const { SlashCommandBuilder } = require("@discordjs/builders");
const { serverStatus } = require("../serverStatus");

module.exports = {
	name: "start",
	aliases: [],
	description: "Start the server",
	log: true,

	buildCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	},

	async execute(interaction, ctx) {
		if (ctx.server.status !== serverStatus.OFFLINE && ctx.server.status !== serverStatus.CRASHED) {
			interaction.reply("Server is not offline!");
			return;
		}
		await ctx.server
			.start()
			.then((result) => {
				interaction.reply("Starting...");
				ctx.startRequest = interaction;
			})
			.catch((e) => {
				interaction.reply("Failed\nReason: " + e.message);
				console.error(e.message);
			});
	},
};
