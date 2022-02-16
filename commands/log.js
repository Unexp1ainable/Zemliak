const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "log",
	aliases: [],
	description: "Log something to the database",

	buildCommand() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption((option) => option.setName("msg").setDescription("Message to be logged."));
	},

	async execute(interaction, ctx) {
		const msg = interaction.options.getString("msg");

		try {
			await ctx.prisma.log.create({
				data: {
					content: msg,
				},
			});
			interaction.reply("Logged");
		} catch (error) {
			console.log(error);
			interaction.reply("Failed: " + error);
		}
	},
};
