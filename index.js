import CONFIG from "./config.json";
import Wechaty from "wechaty";
import SlackBot from "slackbots";
import striptags from "striptags";

const googleTranslate = require("google-translate")(
  CONFIG.GOOGLE_TRANSLATE_API_KEY
);
const slackBot = new SlackBot({
  token: CONFIG.SLACK_BOT_API_KEY,
  name: CONFIG.SLACK_BOT_NAME
});
const wechatBot = new Wechaty();

console.log("Connecting to Slack...");

slackBot.on("start", () => {
  wechatBot
    .on("scan", (qrcode, status) =>
      slackBot.postMessageToChannel(
        "general",
        `Scan QR Code to login: https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          qrcode
        )}`
      )
    )
    .on("login", user => console.log(`User ${user} logined`))
    .on("message", message => {
      message.ready().then(() => {
        const room = message.room();
        const content = message.payload.text;
        const channelInfo =
          room && CONFIG.CHANNELS_MAP[`${room.rawObj.OwnerUin}`];
        if (channelInfo && content.trim() !== "") {
          const from = message.from();
          googleTranslate.translate(content, "en", (err, res) => {
            let str = `*${from.name().trim()}* [${
              channelInfo.LABEL
            }]\n${content}`;
            if (res.translatedText !== res.originalText) {
              str += `\n${res.translatedText} - _translated from ${
                res.detectedSourceLanguage
              }_`;
            }
            console.log(`\n${str}\n`);
            slackBot.postMessageToChannel(channelInfo.SLACK_CHANNEL, str);
          });
        }
      });
    })
    .start();
});

slackBot.on("message", async message => {
  if (message.text === "logout") {
    await wechatBot
      .logout()
      .then(
        slackBot.postMessageToChannel(
          channelInfo.SLACK_CHANNEL,
          "Logout Successfully"
        )
      );
  }
});
