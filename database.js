function log(prisma, message) {
	return prisma.log
		.create({
			data: {
				content: message,
			},
		})
		.then((result) => {})
		.catch((err) => {
			console.log("Failed to send log to database. Reason: " + err);
		});
}

export default {
	log,
};
