const fetch = require('node-fetch')
const slackifyMarkdown = require('slackify-markdown')

const slackNotify = async (
	slackSettings,
	repositoryName,
	releaseBody,
	releaseUrl,
	releaseVersion,
	teamName
) => {
	const { slackWebhookUrl, userName, channel, iconEmoji, shipEmojis } = slackSettings

	const formattedBody = slackifyMarkdown(releaseBody)

	const includeTeamName = teamName && `*Team:* ${teamName}`

	const showShipEmojis = shipEmojis || ':ship: :ship: :ship: :ship: :ship:'

	const additionalBody = `
	${showShipEmojis} \n
	${includeTeamName} \n
	*Repository:* ${repositoryName} \n
	*Version:* ${releaseVersion} \n
	*Release Details:* \n
	${formattedBody} \n
	*Links:* \n
	<${releaseUrl}|View release on Github> \n
	${showShipEmojis}
	`

	const data = {
		text: additionalBody,
		username: userName || `Release Notifier Bot`,
		icon_emoji: iconEmoji,
		channel,
	}

	const slackMsg = await fetch(slackWebhookUrl, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	})
	return slackMsg
}

module.exports = slackNotify
