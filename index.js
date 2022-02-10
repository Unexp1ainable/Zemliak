import dotenv from "dotenv";
import Discord from "discord.js";
import Exaroton from "exaroton";
import Prisma from "@prisma/client";
const { PrismaClient } = Prisma;

import ss from "./serverStatus.js";
const { statusToString, serverStatus } = ss;
import db from "./database.js";

import broadcastCommand from "./commands/broadcast.js";
import hejCommand from "./commands/hej.js";
import statusCommand from "./commands/status.js";
import startCommand from "./commands/start.js";
import stopCommand from "./commands/stop.js";
import restartCommand from "./commands/restart.js";
import helpCommand from "./commands/help.js";
import logCommand from "./commands/log.js";

// load .env
dotenv.config();

// connect to the database
const prisma = new PrismaClient();

// discord stuff
const prefix = process.env.DJS_PREFIX;
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();

// register Discord commands
let commands = [broadcastCommand, hejCommand, statusCommand, startCommand, restartCommand, stopCommand, helpCommand, logCommand];
for (const command of commands) {
	client.commands.set(command.command.name, command.command);
}

// exaroton stuff
const exClient = new Exaroton.Client(process.env.EXAROTON_TOKEN);
let exServer = await exClient.server(process.env.EXAROTON_SERVER_ID).get();
let currentExServerStatus = serverStatus.OFFLINE;

exServer.subscribe();

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
	command.server = exServer;
	command.prisma = prisma;

	// execute command
	try {
		command.execute(message, args, prisma);
		if (command.log) {
			db.log(prisma, message.author.username + " executed command " + command.name);
		}
	} catch (error) {
		console.error(error);
		console.log(server);
		message.reply("there was an error trying to execute that command!");
	}
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
		db.log(prisma, "Server changed status from " + statusToString(currentExServerStatus) + " to " + statusToString(server.status) + ".");
		currentExServerStatus = server.status;
	}

	if (server.status === serverStatus.ONLINE) {
		// update online players
		for (let player of server.players.list) {
			// find player if exists
			let p = await prisma.player.findFirst({
				where: {
					name: player,
				},
			});

			// create player as online if it doesnt exist
			if (!p) {
				await prisma.player
					.create({
						data: {
							name: player,
							logonTime: new Date(),
							online: true,
						},
					})
					.then((result) => {})
					.catch((err) => {
						console.log(err);
					});
			} else {
				// if player was found but is offline, update it to online
				if (!p.online) {
					prisma.player
						.update({
							where: {
								id: p.id,
							},
							data: {
								online: true,
								logonTime: new Date(),
							},
						})
						.then((result) => {})
						.catch((err) => {
							console.log("player upadte failed!", err);
						});
				}
			}
		}

		// update offline players
		let players = await prisma.player.findMany({
			where: {
				online: true,
				name: {
					notIn: server.players.list,
				},
			},
		});

		for (let player of players) {
			// calculate playtime
			let playtime = Math.round((new Date() - player.logonTime) / 1000);

			// set playtime
			let a = await prisma.playtime.create({
				data: {
					length: playtime,
					playerId: player.id,
				},
			});

			// set logonTime to null and online to false
			let b = await prisma.player.update({
				where: {
					id: player.id,
				},
				data: {
					online: false,
					logonTime: null,
				},
			});
		}
	}
	executing = false;
});

client.login(process.env.DJS_TOKEN);
