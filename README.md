# Release Buddy

Release buddy helps to orchestrate some of the common tasks needed when releasing code, such as Slack notifications.

> A GitHub App built with [Probot](https://probot.github.io).

## Docs

This is the repository for the **Release Buddy** Github bot. Release Buddy is intended to streamline the communication around your release.

### Application structure

`handler.js`: When you deploy this to a lambda on AWS, handler.js will be the official entry point. 

`index.js`: handler is really just a wrapper around the index file, which serves the bulk of the application code. When you run the application locally, it is being served by index.js.

### Local Development setup

- Install the dependencies.

```sh
# Install dependencies
yarn install

# Run the bot
yarn start
```

- Visit the url that is created when you run your setup and follow the instructions to setup your github app. The webhook url can be your local smee url for now, but you will eventually want to replace this with the lambda url once you deploy it to AWS.

- Add the required environment variables from the `.env.example` file to a `.env` file in the root folder.

- Setup serverless to work with your AWS account. See the [Quick Start](https://serverless.com/framework/docs/providers/aws/guide/quick-start#pre-requisites) guide.

- Add the required environment variables to your [AWS Parameter Store](https://us-east-2.console.aws.amazon.com/systems-manager/parameters/create), so they can be accessed from the lambda once it has been deployed. You can find the references to these environment variables in the `serverless.yml` file under `functions` > `environment`. They should be entered into Parameter store using that same format (ex: `release-buddy-webhook-secret`).

- Deploy the lambda using `yarn serverless deploy`.

- Update the webhook url Github App you created earlier in your [Developer settings](https://github.com/settings/apps). Select the app name you created, and edit the **Webhook URL** field to the AWS lambda field you deployed.

### Using Release Buddy in your project

Once you have setup the Release Buddy AWS lambda server and created the Github App, you can add Release Buddy to your Github projects following the directions below.

- Add a `releaseBuddy.config.json` file to the root of your projects. See the configuration details below.

``` json
{
	"teamName": "Consumer Website Team", // Enter the name of your team.
	"slackSettings": {
        
		"enabled": true, // enable/disable the Slack notifier
		"slackWebhookUrl": "https://hooks.slack.com/your-slack-webhook-url-here", // your Slack webhook url
		"userName": "Release Buddy", // Slackbot user name
		"channels": ["#channel-name", "#channel-2-name"], // array of slack channels to notify
		"iconEmoji": ":wordpress:", // This will be the Slackbot user's profile image.
		"shipEmojis": ":ship: :ship_it_parrot: :rocket: :ship_it_parrot: :ship:" // These will appear in the slack message to add some pizazz to your release message
	},
	"emailSettings": {
        "enabled": true, // enable/disable the email notifier
        // Sendgrid api docs for formatting: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html
		"to": {
			"name": "Release Buddy", // Replace with any name.
			"email": "no-reply@ecobee.com" // Replace with email of your choice.
		},
		"bcc": ["cam.s@ecobee.com"], // Array of emails to notify
		"from": {
			"name": "Release Buddy", // Replace with any name.
			"email": "no-reply@ecobee.com" // Replace with email of your choice.
		}
	}
}
```

- Publish a new release on your repo at `https://github.com/{github_user}/{repo_name}/releases/new`. Any markdown you include in the body of this release, as well as the **Tag Version** and **Release Title**, will be used in the Slackbot message and email notification.

Your team will now be notified at the channels and emails you have configured.

## Contributing

If you have suggestions for how Release Buddy could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).
