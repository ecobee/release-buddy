const fetch = require('node-fetch')
const slackifyMarkdown = require('slackify-markdown')

const slackNotify = async (slackSettings, repositoryName, releaseDetails, teamName) => {
	const { slackWebhookUrl, userName, channels, iconEmoji, shipEmojis } = slackSettings
	const { name: releaseName, body, url, version } = releaseDetails

	const releaseNotes = slackifyMarkdown(body)

	const includeTeamName = teamName ? `*Team:* ${teamName} \n\n` : ''
	const includeReleaseName = releaseName ? `*Release Name:* ${releaseName} \n\n` : ''
	const showShipEmojis = shipEmojis || ':ship: :ship: :ship: :ship: :ship:'

	const slackMessageText = `${showShipEmojis} \n\n${includeTeamName}*Repo:* ${repositoryName} \n\n*Version:* \`${version}\` \n\n${includeReleaseName}<${url}|View release on Github> \n\n${showShipEmojis}\n\n *Release Notes:*`

	channels.forEach(async channel => {
		const data = {
			text: slackMessageText,
			attachments: [
				{
					text: releaseNotes,
				},
			],
			username: userName || `ReleaseBuddy Bot`,
			icon_emoji: iconEmoji,
			channel,
		}

		const slackMsg = await fetch(slackWebhookUrl, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' },
		})
		console.log(slackMsg)
		return slackMsg
	})
}

module.exports = slackNotify
