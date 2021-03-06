
const slackEmailAndConfluence = {
	teamName: 'Instinct Team',
	slackSettings: {
		enabled: true,
		slackWebhookUrl:
			'https://hooks.slack.com/services/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',
		userName: 'Marowak',
		channels: ['@instinct'],
		iconEmoji: ':ship:',
		shipEmojis: ':ship: :ship_it_parrot: :rocket: :ship_it_parrot: :ship:',
	},
	emailSettings: {
		enabled: true,
		to: {
			name: 'Release Buddy',
			email: 'marowak@instinct.com',
		},
		from: {
			name: 'Release Buddy',
			email: 'releases@instinct.com',
		},
	},
	confluenceSettings: {
		enabled: true,
		"confluenceSpace": "12345"
	}
}

const slackOnly = {
	teamName: 'Mystic Team',
	slackSettings: {
		enabled: true,
		slackWebhookUrl:
			'https://hooks.slack.com/services/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',
		userName: 'Pikachu',
		channels: ['@mystic'],
		iconEmoji: ':ship:',
		shipEmojis: ':ship: :ship_it_parrot: :rocket: :ship_it_parrot: :ship:',
	},
}

const emailOnly = {
	teamName: 'Valor Team',
	emailSettings: {
		enabled: true,
		to: {
			name: 'Release Buddy',
			email: 'charmeleon@valor.com',
		},
		from: {
			name: 'Release Buddy',
			email: 'releases@valor.com',
		},
	},
}

const confluenceOnly = {
	teamName: 'Diamond Team',
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
