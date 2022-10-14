const fs = require('fs').promises;
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { convert } = require('html-to-text');
const log = require('../../helpers/logger');

module.exports = class GmailApi {
	constructor(emailPrefix) {
		// Accessing gmail accounts credentials
		this.CREDENTIALS_PATH = path.resolve(
			__dirname,
			`../.././accounts/${emailPrefix}_Cred.json`
		);
		this.TOKEN_PATH = path.resolve(
			__dirname,
			`../.././accounts/${emailPrefix}_Token.json`
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

	/**
	 * Search gmail inbox
	 *
	 * @param query as a string: settlement's sender
	 * @return array of email ids
	 */
	prepaid_SearchEmailId = async (senderAddress) => {
		const gmail = google.gmail({ version: 'v1', auth: await this.accessToken });

		const query = `from:${senderAddress}`;

		const res = await gmail.users.messages.list({
			userId: 'me',
			q: query,
		});

		// const messageIdsArray = res.data.messages[0].id;
		const messageIdsArray = res.data.messages;

		return messageIdsArray;

		// return [{ id: '1837b02a9734ba90' }];
	};

	/**
	 * Retrieve codes from email body
	 *
	 * @param emailIds array of email's id
	 * @return array of code???
	 */
	prepaid_GetEmailContent = async (emailIds) => {
		log.init(`Searching Inbox`);

		const gmail = google.gmail({ version: 'v1', auth: await this.accessToken });

		const emailCodeArr = [];

		for (let i = 0; i < emailIds.length; i++) {
			// Search inbox based on message ID
			const messageBody = await gmail.users.messages.get({
				userId: 'me',
				id: emailIds[i].id,
			});

			const messagePayload = messageBody.data.payload;

			const mimeType = messagePayload.mimeType;

			if (mimeType === 'text/html') {
				const emailReceiver =
					messagePayload.headers[messagePayload.headers.length - 2].value;
				const encodedMessage = await messagePayload.body.data;

				const decodedStr = Buffer.from(encodedMessage, 'base64').toString(
					'ascii'
				);

				const text = convert(decodedStr, {
					wordwrap: 130,
				});

				// Extract redemption code from email body text
				const redemptionCode = text.match(/(?<=\bcode:\s)(\w+)/g)[0];

				const emailCodeMap = {};

				emailCodeMap.email = emailReceiver;
				emailCodeMap.code = redemptionCode;
				emailCodeMap.url = `https://www.myprepaidcenter.com/redeem?ecode=${redemptionCode}`;

				emailCodeArr.push(emailCodeMap);

				log.status(`Retrieved -> ${emailReceiver} -> ${redemptionCode}`);
			}

			// For mimeType: 'multipart/alternative'
			//const encodedMessage = await message.payload["parts"][0].body.data;
			// const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
		}

		log.success(`Finished Searching Redeem Codes`);

		return emailCodeArr;
	};
};
