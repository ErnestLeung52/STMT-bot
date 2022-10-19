const fs = require('fs');
const path = require('path');

const rootDir = require('path').resolve('./');

const proxiesTxtPath = path.join(rootDir, './config/proxies/proxies.csv');
const proxiesJsonPath = path.join(rootDir, './config/proxies/proxies.json');

const convertProxies = async () => {
	fs.readFile(proxiesTxtPath, (err, data) => {
		const array = data.toString().split('\n');
		fs.writeFile(proxiesJsonPath, JSON.stringify(array), () => {
			console.log('success');
		});
	});
};

module.exports = convertProxies;
