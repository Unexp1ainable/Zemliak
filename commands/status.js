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
		let status = "";
		switch (this.server.status) {
			case 0:
				status = "⚫ Offline";
				break;
			case 1:
				status = "🟢 Online";
				break;
			case 2:
				status = "🔵 Starting";
				break;
			case 3:
				status = "🔴 Stopping";
				break;
			case 4:
				status = "🔴 Restarting";
				break;
			case 5:
				status = "🔵 Saving";
				break;
			case 6:
				status = "🔵 Loading";
				break;
			case 7:
				status = "🔴 Crashed";
				break;
			case 8:
				status = "⚫ Pending";
				break;
			case 10:
				status = "🔵 Preparing";
				break;

			default:
				status = "⚫ Unknown";
				break;
		}

		if (this.server.status === 1) {
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
