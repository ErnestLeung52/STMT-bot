const clc = require('cli-color');

module.exports = log = {
	init: (msg) => {
		console.log(clc.yellowBright.bold(`🚀 ${msg}`, '\n'));
	},
	status: (msg) => {
		console.log(clc.cyanBright(` ${msg} `));
	},
	success: (msg) => {
		console.log(clc.greenBright.bold('\n', `✅ ${msg} `));
	},
	error: (msg) => {
		console.log(clc.redBright.bold(`❌ ${msg} `));
	},
};
