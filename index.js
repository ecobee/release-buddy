/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */

const getConfig = require('./src/getConfig')
const slackNotify = require('./src/slackNotify')
const sendEmail = require('./src/sendMail')

module.exports = app => {
	app.log('Yay, the app was loaded!')

	app.on('release.published', async context => {
		app.log("Yayyy we released. Now let's do some stuff!")

		const configPath = 'releaseBuddy.config.json'
		const config = await getConfig(app.log, context, configPath)
		const { release, repository } = context.payload

		const releaseDetails = {
			name: release.name,
			body: release.body,
			url: release.html_url,
			version: release.tag_name,
		}

		if (!config) {
			app.log(
				`Error loading release notifier configuration details from ${configPath}. Double check that you have added the necessary settings.`
			)
			return
		}
		const { slackSettings, emailSettings, teamName } = config
		const { name: repositoryName } = repository

		if (slackSettings && slackSettings.enabled === true) {
			app.log('Delivering Slack notifications.')

			try {
				const responseMsg = await slackNotify(
					slackSettings,
					repositoryName,
					releaseDetails,
					teamName
				)
				app.log('Slack notifications delivered.')
				app.log(responseMsg)
			} catch (error) {
				app.log('Error delivering slack notification.')
				app.log(error)
			}
		}

		if (emailSettings && emailSettings.enabled === true) {
			app.log('Delivering email notifications.')

			try {
				const mailResponse = await sendEmail(
					emailSettings,
					releaseDetails,
					repositoryName,
					teamName
				)
				app.log(mailResponse)
				app.log('Email notifications delivered.')
			} catch (error) {
				app.log('Error sending email.')
				app.log(error)

				if (error.response.body.errors) {
					app.log(error.response.body.errors)
				} else {
					app.log(error)
				}
			}
		}
	})
}
