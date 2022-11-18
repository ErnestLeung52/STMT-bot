const GmailApi = require('../src/api/services/gmailAPI');
const company = require('../config/settlement/index');

/************* Manual Input *************/
const emailAddress = 'ernestfrwd01';
const settlement = company.NEON;

const retrieveCodes = async () => {
	// Initialize gmail client API
	const gmailClient = new GmailApi(emailAddress);

	// Search for redeem codes matching settlement email pattern
	const emailIds = await gmailClient.searchEmailIds(settlement);

	const redeemCodes = await gmailClient.extractEmailCodes(
		'Redeem',
		emailIds,
		settlement
	);

	console.log(redeemCodes);
};

retrieveCodes();
