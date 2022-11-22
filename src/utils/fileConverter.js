const { writeToPath, write, writeToStream } = require('@fast-csv/format');
const path = require('path');
const rootDir = require('path').resolve('./');
const fs = require('fs');
const log = require('./logger');
const clc = require('cli-color');
const { parseStream } = require('fast-csv');

/**
 * Append [email,code,url] to output CSV file
 *
 * @param data array of objects
 * @param outputFileName string
 * @return undefined
 */
const appendToCSV = async (data, outputFileName) => {
	let outputFilePath;

	// if (outputFileName.includes('Code')) {
	// 	outputFilePath = path.resolve(rootDir, `./logs/${outputFileName}`);
	// } else if (outputFileName.includes('Profile')) {
	// 	outputFilePath = path.resolve(
	// 		rootDir,
	// 		`./config/profiles/${outputFileName}`
	// 	);
	// } else {
	// 	throw 'Unrecognizable file path!!!';
	// }

	outputFilePath = path.resolve(
		rootDir,
		`./logs/redeemCodes/${outputFileName}.csv`
	);

	const options = {
		headers: true,
		writeHeaders: false,
		includeEndRowDelimiter: true,
	};

	if (!fs.existsSync(outputFilePath)) {
		options.writeHeaders = true;
		log.init(`Created New File: ${clc.blueBright(outputFileName)}`);
	}

	// Create stream
	const csvFile = fs.createWriteStream(outputFilePath, { flags: 'a' });

	// writeToStream(stream, rows[, options])
	return new Promise((resolve, reject) => {
		writeToStream(csvFile, data, options)
			.on('error', () => {
				log.error(`Failed appending to ${clc.blueBright(outputFileName)}`);
			})
			.on('finish', () => {
				log.success(`Appended new codes to ${clc.blueBright(outputFileName)}`);
				resolve();
			});
	});
};

/**
 * Save email/code/url to output.csv file
 *
 * @param data array of objects
 * @param gmailPrefix prefix of gmail address
 * @return Promise
 */
const saveToNewCSV = async (data, gmailPrefix) => {
	const outputFileName = `${gmailPrefix}.csv`;
	const outputFilePath = path.resolve(
		__dirname,
		`../outputLogs/${outputFileName}`
	);
	if (fs.existsSync(outputFilePath)) {
		fs.writeFile(outputFilePath, '', () => {
			log.init(`Created File ${clc.blueBright(outputFileName)}`);
		});
	}

	writeToPath(outputFilePath, data, { writeHeaders: true }).on('finish', () =>
		log.success(`Succesfully Wrote to ${clc.blueBright(outputFileName)}`)
	);
	// const write = (filestream, rows, options) => {
	// 	return new Promise((res, rej) => {
	// 		writeToStream(filestream, rows, options)
	// 			.on('error', (err) => rej(err))
	// 			.on('finish', () => res());
	// 	});
	// };
};

/**
 * Convert CSV Profile to JSON and write to profiles folder
 *
 * @param fileName profile file name
 * @return Promise
 */
const convertProfileToJSON = async (fileName) => {
	const profilePath = path.resolve(rootDir, './config/profiles');
	const inputFilePath = path.join(profilePath, `${fileName}.csv`);
	const outputFilePath = path.join(profilePath, `${fileName}.json`);

	const readStream = fs.createReadStream(inputFilePath);
	const profilesArr = [];

	return new Promise((resolve, reject) => {
		parseStream(readStream, { headers: true })
			.on('data', (row) => {
				const profile = {};
				const detail = {};

				detail.firstName = row['FirstName'];
				detail.lastName = row['LastName'];
				detail.fullname = row['FirstName'] + ' ' + row['LastName'];
				detail.email = row['Email'];
				detail.phone = row['Phone'];
				detail.address = row['Address'];
				detail.state = row['State'];
				detail.city = row['City'];
				detail.zip = row['Zip'];
				detail.country = row['Country'];

				profile[row['Email']] = detail;

				profilesArr.push(profile);
			})
			.on('end', () => {
				const jsonProfiles = JSON.stringify(profilesArr, null, 2);
				fs.writeFileSync(outputFilePath, jsonProfiles);
				resolve();
			});
	});
};

const convertProxies = async (fileName) => {
	const proxyFolderPath = path.resolve(rootDir, `./config/proxies`);
	const proxiesCsvPath = path.join(proxyFolderPath, `${fileName}.csv`);
	const proxiesJsonPath = path.join(proxyFolderPath, `${fileName}.json`);

	return new Promise((resolve, reject) => {
		fs.readFile(proxiesCsvPath, (err, data) => {
			const outputArr = [];

			const array = data.toString().split('\n');

			array.forEach((proxy) => {
				outputArr.push({ ip: proxy, used: false });
			});

			fs.writeFile(proxiesJsonPath, JSON.stringify(outputArr), () => {
				resolve(outputArr);
			});
		});
	});
};

const convertCodestoJSON = async (fileName, settlement) => {
	const codesFolderPath = path.resolve(rootDir, './logs/redeemCodes');
	const inputPath = path.join(codesFolderPath, `${fileName}_${settlement}.csv`);
	const outputPath = path.join(
		codesFolderPath,
		`${fileName}_${settlement}.json`
	);

	const readStream = fs.createReadStream(inputPath);

	return new Promise((resolve, reject) => {
		parseStream(readStream, { headers: true }).on((data) => {});
	});
};

module.exports = {
	appendToCSV,
	saveToNewCSV,
	convertProfileToJSON,
	convertProxies,
};
