# Slack WeChat Bridge Bot

Bridge WeChat messages into slack and translate them.

## Usage

Clone this repo, rename `config.example.json` to `config.json` and update the relevant fields.

Start the server, and check the output - you will be given a URL that shows a QR code you must open and scan with your WeChat account. The bot will then relay any messages in the `CHANNELS_MAP` to the given `SLACK_CHANNEL`.

Each WeChat room is identified by `OwnerUin`, which you can find in `room.rawObj.OwnerUin`, which you'll need to figure out how to get yourself (just hack this repo)... There's probably a better way of doing this.

## Licence

MIT, 2016.
