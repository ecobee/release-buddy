const slackEmailAndConfluence = {
	teamName: 'Cam Sloan',
	slackSettings: {
		enabled: true,
		slackWebhookUrl:
			'https://hooks.slack.com/services/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',
		userName: 'Cam Sloan Ship Bot',
		channels: ['@cam'],
		iconEmoji: ':ship:',
		shipEmojis: ':ship: :ship_it_parrot: :rocket: :ship_it_parrot: :ship:',
	},
	emailSettings: {
		enabled: true,
		to: {
			name: 'Release Buddy',
			email: 'cam@sloan.ca',
		},
		from: {
			name: 'Release Buddy',
			email: 'releases@cam.sloan.ca',
		},
	},
	confluenceSettings: {
		enabled: true,
		"confluenceSpace": "12345"
	}
}

const slackOnly = {
	teamName: 'Cam Sloan',
	slackSettings: {
		enabled: true,
		slackWebhookUrl:
			'https://hooks.slack.com/services/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',
		userName: 'Cam Sloan Ship Bot',
		channels: ['@cam'],
		iconEmoji: ':ship:',
		shipEmojis: ':ship: :ship_it_parrot: :rocket: :ship_it_parrot: :ship:',
	},
}

const emailOnly = {
	teamName: 'Cam Sloan',
	emailSettings: {
		enabled: true,
		to: {
			name: 'Release Buddy',
			email: 'cam@sloan.ca',
		},
		from: {
			name: 'Release Buddy',
			email: 'releases@cam.sloan.ca',
		},
	},
}

const confluenceOnly = {
	teamName: 'Cam Sloan',
	confluenceSettings: {
		enabled: true,
		"confluenceSpace": "12345"
	}
}

module.exports = {
	slackEmailAndConfluence,
	slackOnly,
	emailOnly,
	confluenceOnly
}
