let command = {
	name: "hej",
	aliases: [],
	description: "hou",
	category: "category",
	guildOnly: false,
	memberpermissions: "VIEW_CHANNEL",
	adminPermOverride: true,
	cooldown: 2,
	usage: "<usage>",
	log: true,
	execute(message) {
		message.reply("hou");
	},
};

export default { command };
