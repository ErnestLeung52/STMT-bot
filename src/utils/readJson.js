const fs = require('fs');
const path = require('path');
const { convertProxies, convertProfileToJSON } = require('./csvWriter');

const rootDir = require('path').resolve('./');

const readJsonFile = async (fileName) => {
	let filePath;

	if (fileName.includes('proxies')) {
		await convertProxies(fileName);

		filePath = path.resolve(rootDir, `./config/proxies/${fileName}.json`);
	} else {
		await convertProfileToJSON(fileName);

		filePath = path.resolve(rootDir, `./config/profiles/${fileName}.json`);
	}

	const rawData = fs.readFileSync(filePath);

	return JSON.parse(rawData);
};

module.exports = readJsonFile;
