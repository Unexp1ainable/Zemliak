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
		let name = interaction.member.nickname;
		if (!name) {
			name = interaction.member.user.username;
		}

		await ctx.server
			.executeCommand("say " + name + ": " + msg)
			.then((result) => {
				interaction.reply("**" + name + "**" + ": " + msg);
				ctx.lastBroadcast = interaction;

				let promise = new Promise((resolve, reject) => {
					setTimeout(() => {
						if (ctx.lastBroadcast === interaction) {
							ctx.lastBroadcast = null;
						}
						resolve(); // resolve when setTimeout is done.
					}, 900000);
				});
			})
			.catch((e) => {
				interaction.reply("Failed\nReason: " + e.message);
				console.error(e.message);
			});
	},
};
