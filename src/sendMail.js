const sgMail = require('@sendgrid/mail')
const removeMd = require('remove-markdown')
const { markdown } = require('markdown')

const replaceHeadings = copy => {
	const replaceables = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
	return replaceables.reduce((prev, current, index) => {
		const pattern = new RegExp(replaceables[index], 'gi')
		return prev.replace(pattern, 'strong')
	}, copy)
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (emailSettings, releaseDetails, repositoryName, teamName) => {
	const { from, to, bcc } = emailSettings
	const { name: releaseName, body, url, version } = releaseDetails

	const missingRequiredFields = !from || !to

	if (missingRequiredFields) {
		throw new Error('Missing Required fields to send email. Check your configuration file.')
	}

	const html = markdown.toHTML(body)

	const formattedHtml = replaceHeadings(html)

	const plainText = removeMd(body)

	const subject = `Release: ${teamName} ${repositoryName} (${version}): ${releaseName}`

	const msg = {
		to,
		bcc,
		from,
		subject,
		text: `${plainText}\n\nView on Github: ${url}`,
		html: `<strong><u>Release Notes:</u></strong><br/><br/>${formattedHtml}`,
	}

	const response = await sgMail.send(msg)

	return response
}

module.exports = sendMail
