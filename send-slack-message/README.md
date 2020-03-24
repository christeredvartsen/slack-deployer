# Send an interactive message to a Slack channel
This GitHub Action can be used to send an interactive message to a Slack-channel, asking the users to either deploy or abort the application.

## Requirements

The action requires two inputs:

- `slackSecret`: An API token that can be acquired by [creating a Slack application](https://api.slack.com/apps). The app needs the `chat:write` scope to be able to write the message to a channel.
- `slackChannel`: Which channel to send the message to. The Slack application needs to be a member of this channel.

## Usage

The following is an example on how to use this action from your workflow:

```yaml
name: Notify Slack
on: push
jobs:
  notify:
    name: Post a message to Slack
    runs-on: ubuntu-latest
    steps:
      - name: Post message
        uses: christeredvartsen/slack-deployer/send-slack-message@master
        with:
          slackToken: ${{ secrets.SLACK_TOKEN }}
          slackChannel: '#some-channel'
```

The posted message will look like this:

![screenshot]

If you want to change the appearance of the message feel free to poke around in [index.js](index.js). Slack has an an online [Block Kit Builder](https://api.slack.com/tools/block-kit-builder) you can use to play around with different types of messages.

## Update and package the action

Once you have made a change to this action it needs to be packaged. The following npm script can be used to achieve that:

    npm run package

The script requires `ncc` to be installed, which should be installed when doing `npm install`.

## License

MIT

[screenshot]: screenshot.png "Screenshot of Slack message"