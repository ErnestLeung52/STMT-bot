const snapChatSciprt = require('./src/scripts/sites/snap110522');
const NewBrowser = require('./src/utils/pptrBrowser');
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
const catchAll = 'ernestfrwd01@gmail.com';

const runScript = async () => {
	const profiles = await readJsonFile(profilesFile);
	const proxies = await readJsonFile(proxiesFile);

	for (let i = 0; i < profiles.length; i++) {
		const instance = new NewBrowser();

		await snapChatSciprt(instance, profiles[i], proxies[i], catchAll);
	}
};

runScript();
