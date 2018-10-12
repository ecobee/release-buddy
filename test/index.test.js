const { Application } = require('probot')
// Requiring our app implementation
const myProbotApp = require('..')

const releasePublishedPayload = require('./fixtures/release.published.json')
const { slackAndEmail, emailOnly, slackOnly } = require('./fixtures/releaseBuddy.config')

const getConfig = require('../src/getConfig')
const slackNotify = require('../src/slackNotify')
const sendEmail = require('../src/sendMail')

jest.mock('../src/getConfig')
jest.mock('../src/slackNotify')
jest.mock('../src/sendMail')

describe('My Probot app', () => {
	let app
	let github

	beforeEach(() => {
		app = new Application()
		// Initialize the app based on the code from index.js
		app.load(myProbotApp)
		// This is an easy way to mock out the GitHub API
		github = {
			issues: {
				createComment: jest.fn().mockReturnValue(Promise.resolve({})),
			},
		}
		// Passes the mocked out GitHub API into out app instance
		app.auth = () => Promise.resolve(github)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	test('calls slackNotify when it is enabled in the settings.', async () => {
		getConfig.mockReturnValueOnce(slackOnly)

		await app.receive({
			name: 'release',
			payload: releasePublishedPayload,
		})

		expect(slackNotify).toHaveBeenCalled()
	})

	test('does not call slackNotify when it is not enabled in the settings.', async () => {
		getConfig.mockReturnValueOnce(emailOnly)

		await app.receive({
			name: 'release',
			payload: releasePublishedPayload,
		})

		expect(slackNotify).not.toHaveBeenCalled()
	})

	test('calls sendMail when it is enabled in the settings.', async () => {
		getConfig.mockReturnValueOnce(emailOnly)

		await app.receive({
			name: 'release',
			payload: releasePublishedPayload,
		})

		expect(sendEmail).toHaveBeenCalled()
	})

	test('does not call sendMail when it is not enabled in the settings.', async () => {
		getConfig.mockReturnValueOnce(slackOnly)

		await app.receive({
			name: 'release',
			payload: releasePublishedPayload,
		})

		expect(sendEmail).not.toHaveBeenCalled()
	})

	test('it calls both sendEmail and slackNotify when enabled in the settings.', async () => {
		getConfig.mockReturnValueOnce(slackAndEmail)

		await app.receive({
			name: 'release',
			payload: releasePublishedPayload,
		})

		expect(sendEmail).toHaveBeenCalled()
		expect(slackNotify).toHaveBeenCalled()
	})
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/
