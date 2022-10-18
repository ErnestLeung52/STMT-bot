/***************************************************************
 * Verify Email
 ****************************************************************/

// -------- Company Info -------
const weedKiller = {
	name: 'Weed Killer',
	verify: {
		subject: 'Gilmore v. Monsanto',
		regex: /(?<=\bis:\s)(\w+)/g,
	},
	redeem: {
		regex: /[]/g,
	},
};

const neon = {
	name: 'Neon Makeup',
	redeem: {
		from: 'neonobsessionssettlement@hawkmarketplace.com',
		regex: /(?<=\bcode:\s)(\w+)/g,
	},
};

module.exports = {
	weedKiller,
	neon,
};
