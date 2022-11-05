const {
	createCursor,
	getRandomPagePoint,
	installMouseHelper,
} = require('ghost-cursor');
const { retrieveVerifyCode } = require('../../api');
const proxies = require('../../utils/proxies');

const snapChatSciprt = async (instance, profile, proxy, catchAll) => {
	// const newProxy = await proxies.getIP();
	// instance.options.args.push(`--proxy-server=${newProxy}`);

	// console.log(`Using Proxy --- ${newProxy}`);

	await instance.createBrowser();
	const page = await instance.browser.newPage();

	// await page.goto('https://www.showmyip.com/', {
	// 	waitUntil: 'networkidle0',
	// 	timeout: 0,
	// });

	const cursor = createCursor(page, await getRandomPagePoint(page));
	await installMouseHelper(page);

	await page.goto('https://www.snapillinoisbipasettlement.com/submit-claim', {
		// waitUntil: 'networkidle0',
		waitUntil: 'domcontentloaded',
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
	// await page.click('#skip-guard');
	// await cursor.move('#skip-guard');
	await cursor.click('#skip-guard', { moveSpeed: 300 });

	/*
	await page.waitForSelector('#first_name');
	// await cursor.move('#first_name');
	await cursor.click('#first_name', { moveSpeed: 300 });
	await page.keyboard.type(firstName, { delay: 100 });
	// await page.type('#first_name', firstName);

	await page.waitForSelector('#last_name');
	await cursor.click('#last_name', { moveSpeed: 300 });
	await page.keyboard.type(lastName, { delay: 100 });

	await page.waitForSelector('#street_address_1');
	await cursor.click('#street_address_1', { moveSpeed: 300 });
	await page.keyboard.type(address, { delay: 100 });
	// await page.type('#street_address_1', address);

	await page.waitForSelector('#city');
	await cursor.click('#city', { moveSpeed: 300 });
	await page.keyboard.type(city, { delay: 100 });
	// await page.type('#city', city);

	await page.waitForSelector('#state');
	await cursor.click('#state', { moveSpeed: 300 });
	// await page.click('#state');
	await page.select('#state', state);

	await page.waitForSelector('#zip_code');
	await cursor.click('#zip_code', { moveSpeed: 300 });
	await page.keyboard.type(zip, { delay: 100 });
	// await page.type('#zip_code', zip);

	await page.waitForSelector('#email_address');
	await cursor.click('#email_address', { moveSpeed: 300 });
	await page.keyboard.type(email, { delay: 100 });
	// await page.type('#email_address', email);

	*/

	/*****
	 * Snap Username
	 */

	// const a = await page.$('#contact-information legend');
	// let val = await page.evaluate((el) => el.textContent, a);
	// console.log(val);

	// Scroll down
	await page.evaluate(() => {
		document.querySelector('#certification').scrollIntoView(false);
	});

	// Payment Selection
	await page.waitForSelector('iframe');

	const elementHandle = await page.$(
		'iframe[src="https://content.digitaldisbursements.com/v1.4.3/index.html?099ae70cff6ad971300fd14d6d403e722474605a4ad34b22dc338c09777fedfd&%7B%22verify%22%3Afalse%7D"]'
	);

	const frame = await elementHandle.contentFrame();

	const paymentWrapperDiv = await frame.$$(
		'.MuiGrid-container button',
		(el) => el.innerHTML
	);

	// Working
	const a = await frame.$('.MuiGrid-container > div > div button');
	await a.click();

	// Working
	// await paymentWrapperDiv[1].click();
	// await cursor.click(paymentWrapperDiv[1]);

	// const code = await retrieveVerifyCode();

	// await page.waitForSelector('#snapchat_username');
	// await page.type('#snapchat_username', code);

	await page.waitForTimeout(40000);

	// await instance.browser.close();
};

module.exports = snapChatSciprt;
