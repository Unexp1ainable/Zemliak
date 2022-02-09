let command = {
	name: "stop",
	aliases: [],
	description: "Stop server",
	category: "category",
	guildOnly: false,
	memberpermissions: "VIEW_CHANNEL",
	adminPermOverride: true,
	cooldown: 2,
	usage: "",
	log: true,
	server: null,
	async execute(message, args) {
		let str = "";
		for (let arg of args) {
			str += arg + " ";
		}

		if (this.server.status !== 1) {
			message.reply("Server is not online!");
			return;
		}
		await this.server
			.stop()
			.then((result) => {
				message.react("👍");
			})
			.catch((e) => {
				message.reply("Failed\nReason: " + e.message);
				console.error(e.message);
			});
	},
};

export default { command };
