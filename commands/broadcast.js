const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "broadcast",
	aliases: [],
	description: "Send message to the server chat",

	buildCommand() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption((option) => option.setName("msg").setDescription("Message to be broadcasted to the server."));
	},

	async execute(interaction, ctx) {
		const msg = interaction.options.getString("msg");

		await ctx.server
			.executeCommand("say " + msg)
			.then((result) => {
				interaction.reply("Done");
			})
			.catch((e) => {
				interaction.reply("Failed\nReason: " + e.message);
				console.error(e.message);
			});
	},
};
