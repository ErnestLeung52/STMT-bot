const { writeToPath, write, writeToStream } = require('@fast-csv/format');
const path = require('path');
const fs = require('fs');
const log = require('./logger');
const clc = require('cli-color');

const rows = [
	{ email: '1@gmail.com', code: '123412' },
	{ email: '1@aol.com', code: 'adsfasdf' },
	{ email: '1@yahoo.com', code: '128fdfa92' },
	// ['gmail.com', '12342131,'],
	// ['123gmail.com', '123,'],
	// ['adsfagmail.com', '45631,'],
];

/**
 * Append email/code/url to output.csv file
 *
 * @param data array of objects
 * @return undefined
 */
const appendToCSV = async (data) => {
	const outputFileName = 'codes.csv';
	const outputFilePath = path.resolve(
		__dirname,
		`../outputLogs/${outputFileName}`
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
	writeToStream(csvFile, data, options)
		.on('error', () =>
			log.error(`Failed appending to ${clc.blueBright(outputFileName)}`)
		)
		.on('finish', () =>
			log.success(`Appended new codes to ${clc.blueBright(outputFileName)}`)
		);
};

/**
 * Save email/code/url to output.csv file
 *
 * @param data array of objects
 * @param gmailPrefix prefix of gmail address
 * @return undefined
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
};

// const write = (filestream, rows, options) => {
// 	return new Promise((res, rej) => {
// 		writeToStream(filestream, rows, options)
// 			.on('error', (err) => rej(err))
// 			.on('finish', () => res());
// 	});
// };

module.exports = {
	appendToCSV,
	saveToNewCSV,
};
