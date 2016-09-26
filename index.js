import CONFIG from './config.json';
import Wechaty from 'wechaty';
import SlackBot from 'slackbots';
import striptags from 'striptags';

const googleTranslate = require('google-translate')(CONFIG.GOOGLE_TRANSLATE_API_KEY);
const slackBot = new SlackBot({ token: CONFIG.SLACK_BOT_API_KEY, name: CONFIG.SLACK_BOT_NAME });
const wechatBot = new Wechaty();

console.log('Connecting to Slack...');

slackBot.on('start', () => {
  wechatBot
  .on('scan', ({ url, code }) => console.log(`Scan QrCode to login: ${code}\n${url}`))
  .on('login', user => console.log(`User ${user} logined`))
  .on('message', (message) => {
    message.ready().then(() => {
      const room = message.room();
      const content = striptags(message.get('content'));
      const channelInfo = room && CONFIG.CHANNELS_MAP[`${room.rawObj.OwnerUin}`];
      if (channelInfo && content.trim() !== '') {
        const from = message.from();
        googleTranslate.translate(content, 'en', (err, res) => {
          let str = `*${from.name().trim()}* [${channelInfo.LABEL}]\n${content}`;
          if (res.translatedText !== res.originalText) {
            str += `\n${res.translatedText} - _translated from ${res.detectedSourceLanguage}_`;
          }
          console.log(`\n${str}\n`);
          slackBot.postMessageToChannel(channelInfo.SLACK_CHANNEL, str);
        });
      }
    });
  })
  .init();
});
