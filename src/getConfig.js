const getConfig = async (log, context, configPath) => {
	log(`Getting configuration from the repository's ${configPath} file.`)

	try {
		const file = await context.github.repos.getContent(
			context.repo({
				path: configPath,
			})
		)
		if (!file) {
			log(`Could not retrieve configuration details from the repository's ${configPath}`)
			return undefined
		}
		const configContent = Buffer.from(file.data.content, 'base64').toString()
		const parsedContent = JSON.parse(configContent)

		log('Successfully loaded configuration details.')

		return parsedContent
	} catch (error) {
		log(error)
		return undefined
	}
}

module.exports = getConfig
