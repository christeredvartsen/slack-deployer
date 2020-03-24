const axios = require("axios");
const { createMessageAdapter } = require("@slack/interactive-messages");
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);
const dayjs = require("dayjs");

const port = process.env.PORT || 3000;

slackInteractions.action({ type: "button" }, (payload, respond) => {
  const {
    user: { username },
    message,
    actions: [{ value: actionValue }]
  } = payload;
  const [action, repo] = actionValue.split(":");
  const { GITHUB_TOKEN: githubToken } = process.env;
  const timestamp = dayjs(
    new Date().toLocaleString("en-US", {
      timeZone: "Europe/Oslo"
    })
  ).format("ddd, DD MMM YYYY HH:mm:ss");

  if ("deploy" === action) {
    axios
      .post(
        `https://api.github.com/repos/${repo}/dispatches`,
        { event_type: "deploy" },
        { headers: { authorization: `Bearer ${githubToken}` } }
      )
      .then(() => {
        console.log(`Deployment of ${repo} dispatched`);
      })
      .catch(error => {
        console.log(error);
      });

    message.blocks[4] = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:thumbsup: Deployment initiated by @${username}`
      }
    };
    message.blocks[5].elements.push({
      type: "mrkdwn",
      text: `*Deployed:* ${timestamp}`
    });
  } else if ("cancel" === action) {
    message.blocks[4] = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `~:thumbsdown: Deployment aborted by @${username}~`
      }
    };
    message.blocks[5].elements.push({
      type: "mrkdwn",
      text: `*Cancelled:* ${timestamp}`
    });
  } else {
    console.log(`Invalid action: ${action}`);
  }

  respond(message);
});

(async () => {
  const server = await slackInteractions.start(port);
  console.log(`Listening for events on ${server.address().port}`);
})();
