const { PrismaClient } = require("@prisma/client");

function log(prisma, message) {
	return prisma.log
		.create({
			data: {
				content: message,
			},
		})
		.then((result) => {})
		.catch((err) => {
			console.log("Failed to send log to database. Reason: " + err);
		});
}

/**
 * Updates database to reflect players currently online
 *
 * @param {Server} server
 * @param {PrismaClient} prisma
 */
async function updateOnlinePlayers(server, prisma) {
	for (let player of server.players.list) {
		// any part can fail
		try {
			// find player if exists
			let p = await prisma.player.findFirst({
				where: {
					name: player,
				},
			});

			// create player as online if it doesnt exist
			if (!p) {
				await prisma.player.create({
					data: {
						name: player,
						logonTime: new Date(),
						online: true,
					},
				});
			} else {
				// if player was found but is offline, update it to online
				if (!p.online) {
					await prisma.player.update({
						where: {
							id: p.id,
						},
						data: {
							online: true,
							logonTime: new Date(),
						},
					});
				}
			}
		} catch (error) {
			console.log("updateOnlinePlayers error!\n", error);
		}
	}
}

/**
 * Updates database to reflect players currently offine
 *
 * @param {Server} server
 * @param {PrismaClient} prisma
 */
async function updateOfflinePlayers(server, prisma) {
	try {
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
			await prisma.playtime.create({
				data: {
					length: playtime,
					playerId: player.id,
				},
			});

			// set logonTime to null and online to false
			await prisma.player.update({
				where: {
					id: player.id,
				},
				data: {
					online: false,
					logonTime: null,
				},
			});
		}
	} catch (error) {
		console.log("updateOfflinePlayers error!\n", error);
	}
}

module.exports = { log, updateOnlinePlayers, updateOfflinePlayers };
