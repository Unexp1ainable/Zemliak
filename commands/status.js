const { statusToRichString, serverStatus } = require("../serverStatus.js");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "status",
	aliases: [],
	description: "Print server status",

	buildCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	},

	async execute(interaction, ctx) {
		let status = statusToRichString(ctx.server.status);
		let fields = [
			{
				name: "Status",
				value: status,
			},
		];

		if (ctx.server.status === serverStatus.ONLINE) {
			let players = {};
			players.name = "Players";
			players.value = "";
			for (let p of ctx.server.players.list) {
				players.value += p + "\n";
			}
			if (players.value === "") {
				players.value = "Nobody ):";
			}

			fields.push(players);
		}
		interaction.reply({
			embeds: [
				{
					type: "rich",
					title: `Server info`,
					description: "",
					color: 0x00ffff,
					fields: fields,
				},
			],
		});
	},
};
