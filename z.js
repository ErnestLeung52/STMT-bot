const NewBrowser = require('./src/utils/Browser');
const readJsonFile = require('./src/utils/readJson');

// Import profile.csv, proxy.json, Puppeteer Browser
/* 
Import Profile - loop each profile
- Create a new puppeteer instance, push new proxy to args
- Start browser
- Invoke site settings function
- Solve for Captcha
- Write to csv
*/

const profilesFile = 'testProfile';
const proxiesFile = 'proxies';

const runScript = async () => {
	const profiles = await readJsonFile(profilesFile);
	const proxies = await readJsonFile(proxiesFile);

	for (let i = 0; i < profile.length; i++) {
		const instance = new NewBrowser();
		// instance.options.args.push(`--proxy-server=${'13.56.157.185:3128'}`);
		await instance.createBrowser();
		const page = await instance.browser.newPage();
		snap110522(page, profiles);
	}
};

runScript();
