async function getAccountInfo(client) {
	let account = await client.getAccount();
	console.log("My account is " + account.name + " and I have " + account.credits + " credits.");
}

module.exports = { getAccountInfo };
