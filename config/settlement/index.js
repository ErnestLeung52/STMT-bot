module.exports = companies = {
	// Weedkiller Settlement
	WEEDKILLER: {
		verify: {
			subject: 'Gilmore v. Monsanto',
			regex: /(?<=\bis:\s)(\w+)/g,
		},
		redeem: {
			regex: /[]/g,
		},
	},

	// Neon Settlement
	NEON: {
		redeem: {
			from: 'neonobsessionssettlement@hawkmarketplace.com',
			regex: /(?<=\bcode:\s)(\w+)/g,
		},
	},
};
