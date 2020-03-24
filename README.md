# Use Slack as a manual approval for deploys

This is a proof of concept for using [interactive messages](https://api.slack.com/interactive-messages) on [Slack](https://slack.com) as a manual approval for triggering a deployment of an application using GitHub Actions.

The flow goes like this:

![uml-diagram]

1. Developer commits code to a GitHub repository, triggering a "build" workflow
2. At the end of the workflow, if everything has succeeded, the workflow sends an interactive message to a Slack channel that includes two buttons, `Deploy` or `Abort`.
3. On `Deploy`: Use the [repository dispatch](https://help.github.com/en/actions/reference/events-that-trigger-workflows#external-events-repository_dispatch) event to trigger a "deploy" workflow, that can deploy the application to the cloud.
4. On `Abort`: Simply don't do anything. This is where one can clean up generated images and more if necessary.

The PoC consists of two components:

## Generate and send interactive Slack message

This is implemented as a GitHub Action and can be easily used in existing workflows. The component is located in [send-slack-message](send-slack-message).

## Slack interactive action handler

When a user clicks a button in the interactive Slack message, this component receives the event, and generates a deployment. The component is located in [event-handler](event-handler), and is based on the [@slack/interactive-messages](https://slack.dev/node-slack-sdk/interactive-messages) library.

## License

MIT

[uml-diagram]: flow.png "UML diagram"