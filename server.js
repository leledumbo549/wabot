const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = 60000;

function startBot() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
  });


  client.on('ready', () => {
    console.log('Client is ready!');
    client.is_ready = true;
  });

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  client.on('message_create', async (message) => {
  });

  client.initialize();

  return client;
}

app.get('/', async (req, res) => {
  let resp = { ok: false };

  try {
    const nohp = req.query.nohp;
    const msg = req.query.msg;
    const receiver = '62' + nohp.slice(1) + '@c.us';
    resp = {
      nohp,
      msg,
      receiver,
      ok: false
    };

    if (app.wabot && app.wabot.is_ready) {
      try {
        app.wabot.sendMessage(receiver, msg);
        resp.ok = true;
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
  }

  res.send(resp);
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  app.wabot = startBot();
})