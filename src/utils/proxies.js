const fs = require('fs');
const path = require('path');
const rootDir = require('path').resolve('./');
const proxyFilePath = path.join(rootDir, './config/proxies/proxies.json');
const axios = require('axios');
const HttpProxyAgent = require('http-proxy-agent');

class ProxyList {
	constructor() {
		this.currentProxy = '';
		this.currentIndex = 0;
		this.proxyList = JSON.parse(fs.readFileSync(proxyFilePath));
	}

	// Retrieve working and not used proxy
	getIP = async () => {
		let rotate = true;

		while (rotate) {
			if (this.currentIndex > this.proxyList.length - 1) {
				throw Error('Ran out of Proxies');
			}
			// Update current proxy based on currentIndex
			this.currentProxy = this.proxyList[this.currentIndex];

			const workingProxy = await this.testProxy();

			if (workingProxy && this.currentProxy.used === false) {
				rotate = false;
			}
			this.rotateProxy();
		}

		return this.currentProxy.ip;
	};

	// Rotate Proxy only modify currentIndex
	rotateProxy = () => {
		console.log('Changing new proxy');

		// Skip already used proxy
		if (this.currentProxy.used === true) {
			this.currentIndex++;
			// this.currentProxy = this.proxyList[this.currentIndex];
		} else {
			// Record proxy not been used
			this.currentProxy.used = true;

			// Modified proxylist
			this.proxyList[this.currentIndex] = this.currentProxy;
			this.currentIndex++;
			// this.currentProxy = this.proxyList[this.currentIndex];

			fs.writeFileSync(proxyFilePath, JSON.stringify(this.proxyList));

			this.proxyList = JSON.parse(fs.readFileSync(proxyFilePath));
		}

		return;
	};

	testProxy = async () => {
		try {
			const httpAgent = new HttpProxyAgent(`http://${this.currentProxy.ip}`);
			const response = await axios.get('http://www.google.com/', {
				httpAgent,
			});

			return response.status === 200;
		} catch (error) {
			return false;
		}
	};
}

module.exports = new ProxyList();
