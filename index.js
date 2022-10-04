const puppeteer = require('puppeteer');

// set variables
// handles the new tab or page where the website is/will be loaded
let page = null;
// handles the browser
let browser = null;

// Launch a browser and turn the headless off so that you can see what is going on
browser = puppeteer
	.launch({ headless: false })
	.then(async (browser) => {
		// open a new tab in the browser
		page = (await browser.pages())[0];
		// set device size to stick to only desktop view
		page.setViewport({
			width: 1280,
			height: 800,
			isMobile: false,
		});
		// open a URL
		page.goto(
			'https://weedkilleradclaims.pnclassaction.com/Claim/ClaimantInformation',
			{
				waitUntil: 'networkidle2',
			}
		);

		// wait for the search input to have finished loading on the page
		// await page.waitFor('input[name="FirstName"]');
		// Delay 2seconds before typing
		// await page.waitFor(1000);
		await page.waitForTimeout(4000);
		// target the search input and type into the field with a little delay so you can see whats going on
		await page.type('input[name="FirstName"]', 'Ernest', {
			delay: 5,
		});
		await page.type('input[name="LastName"]', 'Leung', {
			delay: 5,
		});
		// target and click the search button
		// await page.click('input[name="submit-button"]');
		// wait 5 seconds
		// await page.waitFor(5000);
		// close the browser
		await page.waitForTimeout(4000);
		await browser.close();
	})
	.catch((error) => {
		console.log(error);
	});
