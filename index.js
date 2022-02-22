const dotenv = require("dotenv");
const Discord = require("discord.js");
const Exaroton = require("exaroton");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");

const { statusToString, serverStatus } = require("./serverStatus.js");
const db = require("./database.js");

// load .env
dotenv.config();

// connect to the database
const prisma = new PrismaClient();

// discord stuff
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();

// prepare and register Discord commands
toRegister = [];
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/` + file);
	client.commands.set(command.name, command);
	toRegister.push(command.buildCommand());
}
toRegister.push(new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"));
toRegister.map((command) => command.toJSON());
const rest = new REST({ version: "9" }).setToken(process.env.DJS_TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.DJS_CLIENT, process.env.DJS_GUILD), { body: toRegister })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);

// exaroton stuff
const exClient = new Exaroton.Client(process.env.EXAROTON_TOKEN);
let exServer = exClient.server(process.env.EXAROTON_SERVER_ID);
exServer.get();
let currentExServerStatus = serverStatus.OFFLINE;
exServer.subscribe();
exServer.subscribe("console");

// create server context
const ctx = {
	server: exServer,
	prisma: prisma,
	startRequest: null,
	lastBroadcast: null,
	lastBroadcastValidityPromise: null,
};

// On Ready
client.once("ready", () => {
	console.log("Baking successful!");
});

// On Message
client.on("messageCreate", async (message) => {
	if (message.content === "hej" || message.content === "hej") {
		message.channel.send("hou");
		return;
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === "ping") {
		interaction.reply("Pong!");
		return;
	}

	const commandName = interaction.commandName;
	const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	command.execute(interaction, ctx);
});

// on server event
let executing = false;
exServer.on("status", async function (server) {
	// I need to ensure, that only one callback is running, otherwise it caused duplicated rows if the event were too fast
	while (executing) {
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(); // resolve when setTimeout is done.
			}, 200);
		});
	}
	executing = true;

	if (currentExServerStatus !== server.status) {
		db.log(prisma, statusToString(currentExServerStatus) + " => " + statusToString(server.status));
		currentExServerStatus = server.status;
		if (server.status === serverStatus.ONLINE) {
			if (ctx.startRequest) {
				ctx.startRequest.followUp("Server is online!");
				ctx.startRequest = null;
			}
		}
	}

	if (server.status === serverStatus.ONLINE) {
		await db.updateOnlinePlayers(exServer, prisma);
		await db.updateOfflinePlayers(exServer, prisma);
	} else {
		await db.updateOfflinePlayers(exServer, prisma);
	}
	executing = false;
});

exServer.on("console:line", async function (data) {
	const pattern = /\[.*\]: <.+> .+/gm;
	const line = data.line;

	if (line.match(pattern)) {
		const who = line.replace(/\[.*</gm, "").replace(/>.*/gm, "");
		const what = line.replace(/\[.*?>\s*/gm, "");

		if (what.slice(0, 6) === "reply:") {
			if (!ctx.lastBroadcast) {
				await ctx.server
					.executeCommand("say Žemliak: No message to reply to.")
					.then()
					.catch((e) => {
						console.error(e.message);
					});
			} else {
				ctx.lastBroadcast.followUp("**" + who + "**" + ": " + what.replace(/reply:/g, ""));
			}
		} else if (what.slice(0, 4) === "msg:") {
			try {
				const room = await client.channels.fetch(process.env.DJS_BOTROOM);
				room.send("**" + who + "**" + ": " + what.replace(/msg:/g, ""));
			} catch (error) {
				console.log(error);
			}
		}
	}
});

client.login(process.env.DJS_TOKEN);
