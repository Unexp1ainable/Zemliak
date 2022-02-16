const { SlashCommandBuilder } = require("@discordjs/builders");
const { serverStatus } = require("../serverStatus");

module.exports = {
	name: "stop",
	aliases: [],
	description: "Stop server",
	log: true,

	buildCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	},

	async execute(interaction, ctx) {
		if (ctx.server.status !== serverStatus.ONLINE) {
			interaction.reply("Server is not online!");
			return;
		}
		await ctx.server
			.stop()
			.then((result) => {
				interaction.reply("Stopping");
			})
			.catch((e) => {
				interaction.reply("Failed\nReason: " + e.message);
				console.error(e.message);
			});
	},
};
