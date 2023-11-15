const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const moment = require('moment-timezone');

async function run() {
  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('¡Bien! WhatsApp conectado.');
  });

  await client.initialize();

  function cumprimentar() {
    const dataAtual = new Date();
    const hora = dataAtual.getHours();

    let saudacao;

    if (hora >= 6 && hora < 12) {
      saudacao = "¡Buenos días, espero tengas un excelente dia!";
    } else if (hora >= 12 && hora < 17) {
      saudacao = "¡Buenas tardes, espero tengas una excelente tarde!";
    } else {
      saudacao = "¡Buenas noches, espero tengas una excelente noche!";
    }

    return saudacao;
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));

  client.on('message', async msg => {
    if (msg.body.match(/(menu|hola|buenos dias|buenas tardes|buenas noches)/i) && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      chat.sendStateTyping();
      await delay(3000);

      
      const menu = '¡Hola que tal, bienvenido a mi menu!\n' +
      'Por favor elije la opción que deseas ejecutar:\n'+
        '1. Te saludo\n' +
        '2. Te doy la hora y fecha \n' ;

      await client.sendMessage(msg.from, menu);

    } else if (
      msg.body.match(/(1)/i) &&
      msg.from.endsWith('@c.us')
    ) {
      const chat = await msg.getChat();
      chat.sendStateTyping();
      await delay(3000);
      const saudacoes = cumprimentar();
      await client.sendMessage(msg.from, `${saudacoes} `);

    } else if (
      msg.body.match(/(2)/i) &&
      msg.from.endsWith('@c.us')
    ) {
      const chat = await msg.getChat();
      chat.sendStateTyping();
      await delay(3000);

      
      const horafecha = moment().tz('America/Bogota').format('DD-MM-YYYY HH:mm');

      await client.sendMessage(msg.from, `Tu hora y fecha actual es: ${horafecha}`);
    }
  });
}

run().catch(err => console.error(err));
