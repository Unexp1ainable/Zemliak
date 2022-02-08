let command = {
	name: "adduser",
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
			await this.prisma.player.create({
				data: {
					name: message.content,
				},
			});
			console.log(await this.prisma.player.findMany());
		} catch (error) {
			console.log(error);
		}
	},
};

export default { command };
