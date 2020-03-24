const core = require("@actions/core");
const process = require("process");
const axios = require("axios").default;
const dayjs = require("dayjs");

(async () => {
  const {
    GITHUB_ACTOR: actor,
    GITHUB_REPOSITORY: repo,
    GITHUB_SHA: sha
  } = process.env;

  axios
    .post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: core.getInput("slackChannel"),
        text: "New deployment request",
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: "*New deployment request:*" }
          },
          { type: "divider" },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Committer:*\n<https://github.com/${actor}|@${actor}>`
              },
              {
                type: "mrkdwn",
                text: `*Repository:*\n<https://github.com/${repo}|${repo}> (<https://github.com/${repo}/commit/${sha}/checks|workflow>)`
              }
            ]
          },
          { type: "divider" },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Deploy" },
                style: "primary",
                value: `deploy:${repo}`
              },
              {
                type: "button",
                text: { type: "plain_text", text: "Cancel" },
                style: "danger",
                value: "cancel"
              }
            ]
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `*Requested:* ${dayjs(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Europe/Oslo"
                  })
                ).format("ddd, DD MMM YYYY HH:mm:ss")}`
              }
            ]
          }
        ]
      },
      {
        headers: { Authorization: `Bearer ${core.getInput("slackToken")}` }
      }
    )
    .catch(error => {
      core.setFailed(error.message);
    });
})();
