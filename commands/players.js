const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "players",
	aliases: [],
	description: "Shows all players.",

	buildCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	},

	async execute(interaction, ctx) {
		const name = interaction.options.getString("player");
		const players = await ctx.prisma.player.findMany();
		if (!players) {
			interaction.reply("No players in the database.");
			return;
		}

		let body = "";
		for (let player of players) {
			body += player.name + "\n";
		}
		const embed = new Discord.MessageEmbed().setTitle("Players").setDescription("All players that was registered in the database.").setColor("#5cd41c");

		embed.addField("Minecraft names", body);
		embed.setTimestamp();
		interaction.reply({ embeds: [embed] });
	},
};
