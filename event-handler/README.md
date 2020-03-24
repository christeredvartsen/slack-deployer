# Slack interactive message event handler

When a user clicks one of the buttons in the interactive Slack message sent by the [send-slack-message action](../send-slack-message), the Slack application issues an HTTP POST request to an event handler configured in the Slack application.

## Configuration

This application, which is built with the [@slack/interactive-messages package](https://www.npmjs.com/package/@slack/interactive-messages) will need to run somewhere accessible by the Slack infrastructure. You will need to provide an environment variable called `SLACK_SIGNING_SECRET` that is used to verify the incoming requests. You will find the value of this secret in the **Basic Information** part of your Slack Application.

## Usage

Start the server by running:

    npm install
    npm run start

## Events

If a user clicks the `Deploy` button in the generated Slack message, a request will be sent to this server, which will end triggering a `repository_dispatch` event. You can read more about that event in the [GitHub docs](https://help.github.com/en/actions/reference/events-that-trigger-workflows#external-events-repository_dispatch).

You will need a workflow that listens for this type of event:

```yaml
name: Deploy app
on:
  repository_dispatch:
    types: deploy

jobs:
  deploy:
    name: Do a deployment
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy all the things!"
```

## License

MIT