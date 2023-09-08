const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const saveFile = require('./saveFile');

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
  // todo:message to self when it is running.. also a ls to retrieve the audios would be nice
});
async function downloadAudio(message) {
  if (!message.hasMedia) {
    throw new Error('Message has no media');
  }
  const media = await message.downloadMedia();

  if (media.mimetype !== 'audio/ogg; codecs=opus') {
    throw new Error('Message has no audio');
  }
  const audioBase64 = media.data;
  const binaryData = Buffer.from(audioBase64, 'base64');
  return binaryData;
}

client.on('message_create', async (msg) => {
  if (msg.id.self) {
    console.log('this code executes if the message is sent to self:', msg.body);

    if (msg.hasMedia) {
      try {
        const audio = await downloadAudio(msg);
        msg.react('✌');
        saveFile.saveAudio(audio, 'public', 'test');
        console.log('audio:', audio);
      } catch (e) { console.error(e); }
    }
  }
});

client.initialize();
