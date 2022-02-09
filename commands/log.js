let command = {
	name: "log",
	aliases: [],
	description: "",
	category: "category",
	guildOnly: false,
	memberpermissions: "VIEW_CHANNEL",
	adminPermOverride: true,
	cooldown: 2,
	usage: "<usage>",
	async execute(message) {
		try {
			message.reply("hou");
			await this.prisma.log.create({
				data: {
					content: message.content,
				},
			});
			console.log(await this.prisma.log.findMany());
		} catch (error) {
			console.log(error);
		}
	},
};

export default { command };
