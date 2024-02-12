// Importa las bibliotecas necesarias
const {Telegraf} = require('telegraf');
const axios = require('axios');
// Importa las constantes desde el archivo data.js
const {tokentiempo, tokentelegram, headers} = require('./data.js');

// Crea una nueva instancia de Telegraf utilizando el token de Telegram
const bot = new Telegraf(tokentelegram);

// Cuando el bot recibe el comando /start, envía un mensaje de bienvenida
bot.start((ctx) => ctx.reply('Bienvenido a tu bot del clima! Si qyuieres saber el clima de una ciudad, escribe "clima" y el nombre de la ciudad. Ejemplo: clima Buenos Aires'));

// Cuando el bot escucha el mensaje 'clima', solicita al usuario que ingrese el nombre de una ciudad
bot.hears('clima', (ctx) => {
    ctx.reply('Ingresa el nombre de la ciudad para obtener el clima');
});

bot.command('help', (ctx) => {
    ctx.reply('Aquí te dejo algunos comandos que puedes usar:\n\n' +
        '/start - Inicia la conversación con el bot\n' +
        '/help - Muestra esta ayuda\n' +
        'Clima [nombre de la ciudad] - Muestra el clima de la ciudad especificada\n\n' +
        'Si tienes alguna otra pregunta, no dudes en preguntar!');
});

bot.command('news', async (ctx) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines?country=mx&apiKey=7cc6b29c5ab64a79961bc5b2887b1ab7');
        const articles = response.data.articles;
        let news = '';

        articles.forEach((article, index) => {
            news += `${index + 1}. [${article.title}](${article.url})\n`;
        });

        ctx.replyWithMarkdown(news);
    } catch (error) {
        console.error(`Error: ${error}`);
        ctx.reply('Ha ocurrido un error al obtener las noticias');
    }
});

// Cuando el bot recibe un mensaje de texto (que se supone que es el nombre de una ciudad), realiza una solicitud GET a la API de OpenWeatherMap
bot.on('text', (ctx) => {
    let city = ctx.message.text;
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${tokentiempo}`, {headers})
    .then(response => {
        let temp = response.data.main.temp - 273.15;
        let weather = response.data.weather[0].main;
        let icon;
        if (weather === 'Rain') {
            icon = '🌧';
        } else if (temp < 10) {
            icon = '❄️';
        } else if (temp > 25) {
            icon = '☀️';
        } else {
            icon = '⛅';
        }
        ctx.reply(`El clima en ${city} es de ${temp.toFixed(2)}°C ${icon}`);
    })
        .catch(error => {
            // Si ocurre un error durante la solicitud a la API, registra el error y envía un mensaje de error
            console.error(`Error: ${error}`);
            ctx.reply('Ha ocurrido un error al obtener el clima');
        });
});

// Inicia el bot
bot.launch();