let command = {
	name: "help",
	aliases: [],
	description: "Message avaliable commands",
	category: "category",
	guildOnly: false,
	memberpermissions: "VIEW_CHANNEL",
	adminPermOverride: true,
	cooldown: 2,
	usage: "",
	execute(message) {
		message.reply({
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
					],
				},
			],
		});
	},
};

export default { command };
