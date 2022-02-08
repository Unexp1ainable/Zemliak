import dotenv from "dotenv";
import Discord from "discord.js";
import Exaroton from "exaroton";
import Prisma from "@prisma/client";
const { PrismaClient } = Prisma;

import broadcastCommand from "./commands/broadcast.js";
import hejCommand from "./commands/hej.js";
import statusCommand from "./commands/status.js";
import startCommand from "./commands/start.js";
import stopCommand from "./commands/stop.js";
import restartCommand from "./commands/restart.js";
import helpCommand from "./commands/help.js";
import addUserCommand from "./commands/addUser.js";

// load .env
dotenv.config();

// connect to the database
const prisma = new PrismaClient();

// discord stuff
const prefix = process.env.DJS_PREFIX;
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();

// register Discord commands
let commands = [broadcastCommand, hejCommand, statusCommand, startCommand, restartCommand, stopCommand, helpCommand, addUserCommand];
for (const command of commands) {
	client.commands.set(command.command.name, command.command);
}

// exaroton stuff
const exClient = new Exaroton.Client(process.env.EXAROTON_TOKEN);
let gcServer = await exClient.server(process.env.EXAROTON_SERVER_ID).get();

gcServer.subscribe();

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

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	// If command exist
	if (!command) return;

	// Check if command can be executed in DM
	if (command.guildOnly && message.channel.type !== "text") {
		return message.reply("I can't execute that command inside DMs!");
	}

	// Check if args are required
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// inject dependencies
	command.server = gcServer;
	command.prisma = prisma;

	// execute command
	try {
		command.execute(message, args, prisma);
	} catch (error) {
		console.error(error);
		console.log(server);
		message.reply("there was an error trying to execute that command!");
	}
});

client.login(process.env.DJS_TOKEN);
