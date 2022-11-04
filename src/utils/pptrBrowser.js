const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Add plugin to anonymize the User-Agent and signal Windows as platform
const Ua = require('puppeteer-extra-plugin-anonymize-ua');
puppeteer.use(Ua());

// const UserAgent = require('user-agents');
// const userAgent = new UserAgent();

const puppeteerOptions = {
	headless: false,
	defaultViewport: null,
	executablePath:
		'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	// userDataDir:
	// 	'/Users/ernest/Library/Application Support/Google/Chrome/Default',

	args: [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-web-security',
		'--disable-features=IsolateOrigins,site-per-process',
		'--disable-features=site-per-process',
	],
};

class NewBrowser {
	constructor(profile, proxy) {
		this.profile = profile;
		this.proxy = proxy;
		this.options = puppeteerOptions;
		this.browser;
		this.page;
	}

	async createBrowser() {
		this.browser = await puppeteer.launch(this.options);
	}
}

module.exports = NewBrowser;
