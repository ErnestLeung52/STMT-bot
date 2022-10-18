const clc = require('cli-color');

module.exports = log = {
	var: (variable) => {
		return clc.yellow(variable);
	},
	init: (msg) => {
		console.log(clc.blueBright('➡', `${msg}`));
	},
	status: (msg) => {
		console.log(clc.white('   ', `${msg}`));
	},
	success: (msg) => {
		console.log(clc.green('✓', `${msg} `, '\n'));
	},
	error: (msg) => {
		console.log(clc.redBright('⨯', `${msg}`));
	},
};
