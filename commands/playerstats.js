const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "playerstats",
	aliases: [],
	description: "Shows statistics of given player..",

	buildCommand() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption((option) => option.setName("player").setDescription("Minecraft name of the player.").setRequired(true));
	},

	async execute(interaction, ctx) {
		const name = interaction.options.getString("player");
		const player = await ctx.prisma.player.findUnique({
			where: {
				name: name,
			},
			include: {
				Playtime: {
					select: {
						length: true,
						createdAt: true,
					},
				},
			},
		});
		if (!player) {
			interaction.reply("No such player in the database.");
			return;
		}

		// build message body
		let timestr = "```";
		let datestr = "```";
		let sum = 0;
		for (let time of player.Playtime) {
			const sec = time.length % 60;
			const tmp = Math.floor(time.length / 60);
			const min = tmp % 60;
			const hod = Math.floor(tmp / 60);
			timestr += hod + "hod " + min + "min " + sec + "s" + "\n";
			datestr += time.createdAt.toDateString() + "\n";
			sum += time.length;
		}
		timestr += "```";
		datestr += "```";

		const embed = new Discord.MessageEmbed().setTitle("Player statistics: " + name).setDescription("Playtime since start of the period.");

		embed.addField("Date", datestr, true);
		embed.addField("Time", timestr, true);

		const sec = sum % 60;
		const tmp = Math.floor(sum / 60);
		const min = tmp % 60;
		const hod = Math.floor(tmp / 60);
		sumstr = hod + " hod, " + min + " min, " + sec + " s" + "\n";

		embed.addField("Total", sumstr);
		embed.setTimestamp();
		interaction.reply({ embeds: [embed] });
	},
};
