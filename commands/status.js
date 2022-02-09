import ss from "../serverStatus.js";
const { statusToRichString, serverStatus } = ss;

let command = {
	name: "status",
	aliases: [],
	description: "Print server status",
	category: "category",
	guildOnly: false,
	memberpermissions: "VIEW_CHANNEL",
	adminPermOverride: true,
	usage: "",
	server: null,
	async execute(message, args) {
		let status = statusToRichString(this.server.status);

		if (this.server.status === serverStatus.ONLINE) {
			let players = {};
			players.name = "Players";
			players.value = "";
			for (let p of this.server.players.list) {
				players.value += p + "\n";
			}
			if (players.value === "") {
				players.value = "Nobody ):";
			}

			message.channel.send({
				embeds: [
					{
						type: "rich",
						title: `Server info`,
						description: "",
						color: 0x00ffff,
						fields: [
							{
								name: "Status",
								value: status,
							},
							players,
						],
					},
				],
			});
		} else {
			message.channel.send({
				embeds: [
					{
						type: "rich",
						title: `Server info`,
						description: "",
						color: 0x00ffff,
						fields: [
							{
								name: "Status",
								value: status,
							},
						],
					},
				],
			});
		}
	},
};

export default { command };
