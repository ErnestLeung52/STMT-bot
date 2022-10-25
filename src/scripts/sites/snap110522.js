const { retrieveVerifyCode } = require('../../api');
const proxies = require('../../utils/proxies');

const snapChatSciprt = async (instance, profile, proxy, catchAll) => {
	const newProxy = await proxies.getIP();
	instance.options.args.push(`--proxy-server=${newProxy}`);

	await instance.createBrowser();
	const page = await instance.browser.newPage();

	await page.goto('https://www.showmyip.com/', {
		waitUntil: 'networkidle0',
		timeout: 0,
	});

	/*

	await page.goto('https://www.snapillinoisbipasettlement.com/submit-claim', {
		waitUntil: 'networkidle0',
		timeout: 0,
	});

	const {
		firstName,
		lastName,
		email,
		phone,
		address,
		state,
		city,
		zip,
		country,
	} = profile;

	// Click button to proceed without Notice ID
	await page.waitForSelector('#skip-guard');
	await page.click('#skip-guard');

	await page.waitForSelector('#first_name');
	await page.type('#first_name', firstName);

	await page.waitForSelector('#last_name');
	await page.type('#last_name', lastName);

	await page.waitForSelector('#last_name');
	await page.click('#last_name');

	await page.waitForSelector('#street_address_1');
	await page.type('#street_address_1', address);

	await page.waitForSelector('#city');
	await page.type('#city', city);

	await page.waitForSelector('#state');
	await page.click('#state');
	await page.select('#state', state);

	await page.waitForSelector('#zip_code');
	await page.type('#zip_code', zip);

	await page.waitForSelector('#email_address');
	await page.type('#email_address', email);

	// const code = await retrieveVerifyCode();

	// await page.waitForSelector('#snapchat_username');
	// await page.type('#snapchat_username', code);

*/

	await page.waitForTimeout(4000);

	await instance.browser.close();
};

module.exports = snapChatSciprt;
