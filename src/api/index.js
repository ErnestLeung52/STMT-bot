const GmailApi = require('./services/gmailAPI');
const { appendToCSV } = require('../utils/fileConverter');
const { weedKiller, neon } = require('../../config/settlement/index.js');

const example = {
	name: 'Ernest Leung',
	email: 'ernestleaung6010w@gmail.com',
	mainEmail: 'ernestfrwd01',
	address: '11411 VuePointe Way...',
};

const retrieveVerifyCode = async (profile, settlement) => {
	const g = new GmailApi('ernestfrwd01');

	const emailIds = await g.searchEmailIds(
		weedKiller,
		'ernestleaung6010w@gmail.com'
	);

	const verifyCodes = await g.extractEmailCodes(
		'Verify',
		emailIds,
		weedKiller,
		'ernestleaung6010w@gmail.com'
	);

	return verifyCodes;
};

const redeemCodes = async () => {
	// const g = new GmailApi('ernestfrwd01');
	// const emailIds = await g.searchEmailIds(neon);
	// const redeemCodes = await g.extractEmailCodes('Redeem', emailIds, neon)
	// await appendToCSV(codes);
};

module.exports = { retrieveVerifyCode };
