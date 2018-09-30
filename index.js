/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */

const getConfig = require('./src/getConfig')
const slackNotify = require('./src/slackNotify')

module.exports = app => {
	app.log('Yay, the app was loaded!')

	app.on('release', async context => {
		app.log("Yayyy we released. Now let's do dome stuff!")

		const configPath = 'releaseNotifier.config.json'
		const config = await getConfig(app.log, context, configPath)
		const { release, repository } = context.payload

		if (!config) {
			app.log(
				`Error loading release notifier configuration details from ${configPath}. Double check that you have added the necessary settings.`
			)
			return
		}
		const { slackSettings, emailSettings } = config

		if (slackSettings && slackSettings.enabled === true) {
			const repositoryName = repository.name
			const releaseBody = release.body
			const releaseUrl = release.html_url
			const releaseVersion = release.tag_name
			const { teamName } = config

			const responseMsg = await slackNotify(
				slackSettings,
				repositoryName,
				releaseBody,
				releaseUrl,
				releaseVersion,
				teamName
			)

			app.log(responseMsg)
		}

		if (emailSettings && emailSettings.enabled === true) {
			const { emailAddresses } = emailSettings
			if (!emailAddresses) {
				app.log(
					'No email addresses defined. Please add an "emailAddresses" array property to the "emailSettings" object in releaseNotifier.config.json file.'
				)
				return
			}
			app.log(emailAddresses)
		}
	})

	// app.on('release', async context => {
	//   app.log('yayyy we released.')

	//   const {owner, name} = context.payload.repository

	//   const hello = await context.github.repos.getContent(context.repo({
	//     path: 'version/v1.0.1.md',
	//   }))

	//   const content = Buffer.from(hello.data.content, 'base64').toString()

	//   app.log(content)
	// })
}
