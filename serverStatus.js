const serverStatus = {
	OFFLINE: 0,
	ONLINE: 1,
	STARTING: 2,
	STOPPING: 3,
	RESTARTING: 4,
	SAVING: 5,
	LOADING: 6,
	CRASHED: 7,
	PENDING: 8,
	PREPARING: 10,
};

function statusToString(status) {
	let statStr = "";
	switch (status) {
		case 0:
			statStr = "Offline";
			break;
		case 1:
			statStr = "Online";
			break;
		case 2:
			statStr = "Starting";
			break;
		case 3:
			statStr = "Stopping";
			break;
		case 4:
			statStr = "Restarting";
			break;
		case 5:
			statStr = "Saving";
			break;
		case 6:
			statStr = "Loading";
			break;
		case 7:
			statStr = "Crashed";
			break;
		case 8:
			statStr = "Pending";
			break;
		case 10:
			statStr = "Preparing";
			break;

		default:
			statStr = "Unknown";
			break;
	}
	return statStr;
}

function statusToRichString(status) {
	let statStr = "";
	switch (status) {
		case 0:
			statStr = "⚫ Offline";
			break;
		case 1:
			statStr = "🟢 Online";
			break;
		case 2:
			statStr = "🔵 Starting";
			break;
		case 3:
			statStr = "🔴 Stopping";
			break;
		case 4:
			statStr = "🔴 Restarting";
			break;
		case 5:
			statStr = "🔵 Saving";
			break;
		case 6:
			statStr = "🔵 Loading";
			break;
		case 7:
			statStr = "🔴 Crashed";
			break;
		case 8:
			statStr = "⚫ Pending";
			break;
		case 10:
			statStr = "🔵 Preparing";
			break;

		default:
			statStr = "⚫ Unknown";
			break;
	}
	return statStr;
}

module.exports = { serverStatus, statusToRichString, statusToString };
