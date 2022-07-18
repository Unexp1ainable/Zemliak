const { statusToRichString, serverStatus } = require("../serverStatus.js");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "dynip",
	aliases: [],
	description: "Show server's dynamic ip address.",

	buildCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	},

	async execute(interaction, ctx) {
		if (ctx.server.status === serverStatus.ONLINE) {
			interaction.reply(ctx.server.host + ":" + ctx.server.port);
		}
	},
};
