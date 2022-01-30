module.exports = {
	name: "broadcast",
	aliases: [],
	description: "Send message to the server chat",
	category: "category",
	guildOnly: false,
	memberpermissions: "VIEW_CHANNEL",
	adminPermOverride: true,
	cooldown: 2,
	usage: "<message>",
	server: null,
	async execute(message, args) {
		let str = "";
		for (let arg of args) {
			str += arg + " ";
		}

		await this.server
			.get()
			.then((result) => {
				console.log(result);
				result
					.executeCommand("say " + str)
					.then((result) => {
						message.reply("Success");
					})
					.catch((e) => {
						message.reply("Failed\nReason: " + e.message);
						console.error(e.message);
					});
			})

			.catch((e) => {
				message.reply("Failed\nReason: " + e.message);
				console.error(e.message);
			});
	},
};
