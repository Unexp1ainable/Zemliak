const { MessageFlags } = require("discord.js");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "endperiod",
	aliases: [],
	description: "Summarizes current playtimes and prepares database for the next period.",
	log: true,
	buildCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	},

	async execute(interaction, ctx) {
		if (interaction.member.roles.cache.some((role) => role.name === "Baker")) {
			interaction.reply("yes");
		} else {
			interaction.reply("no");
		}
	},
};
