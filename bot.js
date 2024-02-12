const {Telegraf} = require('telegraf');
const axios = require('axios');
const {tokentiempo, tokentelegram, headers} = require('./data.js');
module.exports = {tokentiempo, tokentelegram, headers};

const bot = new Telegraf(tokentelegram);
https://history.openweathermap.org/data/2.5/history/city?lat=41.85&lon=-87.65&appid=ae22f43aba7ad10eb86dd2e369819e7a

bot.start((ctx) => ctx.reply('Bienvenido a tu bot de clima!'));
bot.hears('clima', (ctx) => {
    ctx.reply('Ingresa el nombre de la ciudad para obtener el clima');
});

bot.on('text', (ctx) => {
    let city = ctx.message.text;
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${tokentiempo}`, {headers})
        .then(response => {
            let temp = response.data.main.temp - 273.15; // Convert from Kelvin to Celsius
            ctx.reply(`El clima en ${city} es de ${temp.toFixed(2)}°C`);
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            ctx.reply('Ha ocurrido un error al obtener el clima');
        });
});

bot.launch();