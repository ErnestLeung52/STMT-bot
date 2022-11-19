const GmailApi = require('../src/api/services/gmailAPI');
const companies = require('../config/settlement/index');
const { appendToCSV } = require('../src/utils/fileConverter');

/************* Manual Input *************/
const emailAddress = 'ernestfrwd01';
const company = 'NEON';

const retrieveCodes = async () => {
	const settlement = companies[company];

	// Initialize gmail client API
	const gmailClient = new GmailApi(emailAddress);

	// Search for redeem codes matching settlement email pattern
	const emailIds = await gmailClient.searchEmailIds(settlement);

	const redeemCodes = await gmailClient.extractEmailCodes(
		'Redeem',
		emailIds,
		settlement
	);

	appendToCSV(redeemCodes, emailAddress + `_${company}`);
};

retrieveCodes();
