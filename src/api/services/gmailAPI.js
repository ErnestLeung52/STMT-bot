const fs = require('fs').promises;
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { convert } = require('html-to-text');
const log = require('../../utils/logger');

const rootDir = require('path').resolve('./');

module.exports = class GmailApi {
	constructor(emailPrefix) {
		// Accessing gmail accounts credentials
		this.CREDENTIALS_PATH = path.join(
			rootDir,
			`./config/accounts/${emailPrefix}_Cred.json`
		);
		this.TOKEN_PATH = path.join(
			rootDir,
			`./config/accounts/${emailPrefix}_Token.json`
		);

		// If modifying these scopes, delete token.json.
		this.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

		// Retrieve token to access gmail inbox
		this.accessToken = this.authorize();
	}

	// * Reads previously authorized credentials from the save file.
	loadSavedCredentialsIfExist = async () => {
		// The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
		try {
			const content = await fs.readFile(this.TOKEN_PATH);
			const credentials = JSON.parse(content);
			return google.auth.fromJSON(credentials);
		} catch (err) {
			return null;
		}
	};

	// * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
	saveCredentials = async (client) => {
		const content = await fs.readFile(this.CREDENTIALS_PATH);
		const keys = JSON.parse(content);
		const key = keys.installed || keys.web;
		const payload = JSON.stringify({
			type: 'authorized_user',
			client_id: key.client_id,
			client_secret: key.client_secret,
			refresh_token: client.credentials.refresh_token,
		});

		await fs.writeFile(this.TOKEN_PATH, payload);
	};

	// * Load or request or authorization to call APIs.
	authorize = async () => {
		let client = await this.loadSavedCredentialsIfExist();
		if (client) {
			this.accessToken = client;
			return client;
		}
		client = await authenticate({
			scopes: this.SCOPES,
			keyfilePath: this.CREDENTIALS_PATH,
		});

		if (client.credentials) {
			await this.saveCredentials(client);
		}

		this.accessToken = client;
		return client;
	};

	/***************************************************************
	 * Private methods for querying emails
	 ****************************************************************/

	/*************************
	 * Email Verification & Prepaid Card
	 * Search gmail inbox
	 * @param settlement nested object containing settlement information
	 * @param to verification code receiver address
	 * @return array of object id:'string'
	 */
	searchEmailIds = async (settlement, to) => {
		log.init(`Searching Inbox for Email IDs`);
		const gmail = google.gmail({ version: 'v1', auth: await this.accessToken });

		let query = '';

		// Define redeem or verify query
		if (to === undefined) {
			query = `from:(${settlement.redeem.from})`;
			log.status(`Searching Email IDs from ${log.var(settlement.name)}`);
		} else {
			query = `to:(${to}) subject:(${settlement.verify.subject})`;
			log.status(
				`Searching Email ID for ${log.var(settlement.name)} sent to ${log.var(
					to
				)} `
			);
		}

		const delay = async (t) => {
			return new Promise((resolve) => {
				setTimeout(resolve, t);
			});
		};

		let retries = 10;
		let messageIdsArray;

		for (let i = 1; i < retries; i++) {
			const res = await gmail.users.messages.list({
				userId: 'me',
				q: query,
			});

			messageIdsArray = res.data.messages;

			if (messageIdsArray === undefined) {
				log.status(`Attempt ${i}/${retries}: retrying in ${i * 2} seconds...`);
				await delay(i * 2000);
			} else {
				log.success(`Found ${log.var(messageIdsArray.length)} Email ID(s)`);
				// [{ id: '1837b02a9734ba90' }];
				return messageIdsArray;
			}
		}

		log.error(`Failed Searching For ${log.var(query)}.`);
		throw Error(`Failed query: ${query}`);
	};

	/**************************
	 * Email Verification & Prepaid Card
	 * Retrieve codes from email body
	 * @param emailIdsArr array of object with email's id
	 * @param parseRegex find matching codes from html/text
	 * @return array of code???
	 */
	extractEmailCodes = async (action, emailIdsArr, settlement, to) => {
		log.init(`Retrieving Email Body for ${log.var(action)}`);

		const gmail = google.gmail({ version: 'v1', auth: await this.accessToken });

		const redeemCodesArr = [];

		for (let i = 0; i < emailIdsArr.length; i++) {
			// Search inbox based on message ID
			const messageBody = await gmail.users.messages.get({
				userId: 'me',
				id: emailIdsArr[i].id,
			});

			const messagePayload = messageBody.data.payload;

			if (messagePayload.mimeType === 'text/html') {
				const redeemCodesMap = {};

				const encodedMessage = await messagePayload.body.data;
				const decodedStr = Buffer.from(encodedMessage, 'base64').toString(
					'ascii'
				);

				// convert html email body to text
				const emailBodyText = convert(decodedStr, {
					wordwrap: 130,
				});

				// ------------------------------------------

				const { regex } =
					action === 'Verify' ? settlement.verify : settlement.redeem;

				// Extract code from email body text
				const code = emailBodyText.match(regex)[0];

				if (emailIdsArr.length === 1) {
					log.status(`Verification Code: ${log.var(code)}  (${to})`);
					log.success(`Finished Searching Verification Code`);

					return code;
				} else {
					const email =
						messagePayload.headers[messagePayload.headers.length - 2].value;

					redeemCodesMap.email = email;
					redeemCodesMap.code = code;
					redeemCodesMap.url = `https://www.myprepaidcenter.com/redeem?ecode=${code}`;

					log.status(`Redemption Code: ${log.var(code)}  (${email})`);
				}

				redeemCodesArr.push(redeemCodesMap);
			}

			// For mimeType: 'multipart/alternative'
			//const encodedMessage = await message.payload["parts"][0].body.data;
			// const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
		}

		log.success(`Finished Searching Redeem Codes`);

		return redeemCodesArr;
	};
};
