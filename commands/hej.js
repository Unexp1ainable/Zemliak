const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "hej",
	aliases: [],
	description: "hou",

	buildCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	},

	execute(interaction) {
		interaction.reply("hou");
	},
};
