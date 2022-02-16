const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "help",
	aliases: [],
	description: "List avaliable commands",

	buildCommand() {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addBooleanOption((option) => option.setName("haňbim_še").setDescription("Reply just to you.").setRequired(false));
	},

	execute(interaction) {
		const eph = interaction.options.getBoolean("haňbim_še");
		interaction.reply({
			embeds: [
				{
					type: "rich",
					title: `Help`,
					description: `Commands by Žemliak`,
					color: 0x00ffff,
					fields: [
						{
							name: `/status`,
							value: `Show server status.`,
						},
						{
							name: `/start`,
							value: `Start the server.`,
						},
						{
							name: `/stop`,
							value: `Stop the server.`,
						},
						{
							name: `/restart`,
							value: `Restart the server.`,
						},
						{
							name: `/broadcast`,
							value: `Send message to the server chat.`,
						},
						{
							name: `/playerstats <player>`,
							value: `Show statistics of the player.`,
						},
						{
							name: `/players`,
							value: `Show all registered players.`,
						},
					],
				},
			],

			ephemeral: eph,
		});
	},
};
