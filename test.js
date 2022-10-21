const NewBrowser = require('./src/utils/Browser');

const main = async () => {
	const instance = new NewBrowser();

	// instance.options.args.push(`--proxy-server=${'13.56.157.185:3128'}`);

	await instance.createBrowser();

	const page = await instance.browser.newPage();

	// await page.goto('https://abrahamjuliot.github.io/creepjs/');
	// await page.goto('https://amiunique.org/fp');
	// await page.goto(
	// 	'https://antcpt.com/eng/information/demo-form/recaptcha-3-test-score.html'
	// );
	await page.goto('https://bot.sannysoft.com');
	// await page.goto('https://pixelscan.net/');
	// await page.goto('https://whatismyipaddress.com/');

	// await page.goto('https://accounts.google.com/signin/v2/identifier', {
	// 	waitUntil: 'networkidle0',
	// });

	// // await page.waitForNavigation();

	// await page.waitForSelector('#identifierId');

	// await page.type('[type="email"]', 'hennest14@gmail.com');

	// await page.waitForTimeout(4000);
	// await page.click('#identifierNext', {delay: 2});

	// await page.type('[type="password"]', 'sryCoffee14.');
};

main();
