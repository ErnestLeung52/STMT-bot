const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

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

		console.log(this.TOKEN_PATH);

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

	searchEmailId = async (query = 'notice@pnclassaction.com') => {
		const gmail = google.gmail({ version: 'v1', auth: await this.accessToken });

		const res = await gmail.users.messages.list({
			userId: 'me',
			q: query,
			maxResults: 5,
		});
		const msgId = res.data.messages[0].id;

		console.log(msgId);

		return msgId;
	};
};
