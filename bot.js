/**
 * Bot de Telegram que proporciona información del clima y noticias.
 * @fileoverview
 */

const { Telegraf } = require('telegraf');
const axios = require('axios');

/**
 * Importa las constantes necesarias desde el archivo data.js.
 * @module data
 */
const { tokentiempo, tokentelegram, headers } = require('./data.js');

/**
 * Crea una nueva instancia de Telegraf utilizando el token de Telegram.
 * @type {Telegraf}
 */
const bot = new Telegraf(tokentelegram);

/**
 * Envía un mensaje de bienvenida cuando el bot recibe el comando /start.
 * @function
 * @param {Object} ctx - El contexto de Telegraf.
 * @returns {Promise<void>}
 */
bot.start((ctx) => {
    /**
     * @param {Object} ctx - El contexto de Telegraf.
     */
    return ctx.reply('Bienvenido a tu bot del clima! Si quieres saber el clima de una ciudad, escribe "clima" y el nombre de la ciudad. Ejemplo: clima Buenos Aires. Si quieres ver las noticias más recientes, escribe /news. Si necesitas ayuda, escribe /help.');
});

/**
 * Solicita al usuario que ingrese el nombre de una ciudad cuando el bot escucha el mensaje 'clima'.
 * @function
 * @param {Object} ctx - El contexto de Telegraf.
 * @returns {Promise<void>}
 */
bot.hears('clima', (ctx) => {
    /**
     * @param {Object} ctx - El contexto de Telegraf.
     */
    return ctx.reply('Ingresa el nombre de la ciudad para obtener el clima');
});

/**
 * Proporciona ayuda al usuario sobre cómo utilizar el bot.
 * @function
 * @param {Object} ctx - El contexto de Telegraf.
 * @returns {Promise<void>}
 */
bot.command('help', (ctx) => {
    /**
     * @param {Object} ctx - El contexto de Telegraf.
     */
    return ctx.reply('Aquí te dejo algunos comandos que puedes usar:\n\n' +
        '/start - Inicia la conversación con el bot\n' +
        '/help - Muestra esta ayuda\n' +
        '/news - Muestra las noticias más recientes\n' +
        'Clima [nombre de la ciudad] - Muestra el clima de la ciudad especificada\n\n' +
        'Si tienes alguna otra pregunta, no dudes en preguntar!');
});

/**
 * Proporciona las noticias más recientes al usuario.
 * @function
 * @async
 * @param {Object} ctx - El contexto de Telegraf.
 * @returns {Promise<void>}
 */
bot.command('news', async (ctx) => {
    try {
        /**
         * @param {Object} response - La respuesta de la solicitud HTTP.
         */
        const response = await axios.get('https://newsapi.org/v2/top-headlines?country=mx&apiKey=7cc6b29c5ab64a79961bc5b2887b1ab7');
        const articles = response.data.articles;
        let news = '';

        articles.forEach((article, index) => {
            news += `${index + 1}. [${article.title}](${article.url})\n`;
        });

        /**
         * @param {Object} ctx - El contexto de Telegraf.
         */
        return ctx.replyWithMarkdown(news);
    } catch (error) {
        console.error(`Error: ${error}`);
        /**
         * @param {Object} ctx - El contexto de Telegraf.
         */
        return ctx.reply('Ha ocurrido un error al obtener las noticias');
    }
});

/**
 * Obtiene el clima de una ciudad especificada por el usuario y lo envía como respuesta.
 * @function
 * @param {Object} ctx - El contexto de Telegraf.
 * @returns {Promise<void>}
 */
bot.on('text', (ctx) => {
    /**
     * @param {string} city - El nombre de la ciudad ingresado por el usuario.
     */
    let city = ctx.message.text;
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${tokentiempo}`, { headers })
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
            /**
             * @param {Object} ctx - El contexto de Telegraf.
             */
            return ctx.reply(`El clima en ${city} es de ${temp.toFixed(2)}°C ${icon}`);
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            /**
             * @param {Object} ctx - El contexto de Telegraf.
             */
            return ctx.reply('Ha ocurrido un error al obtener el clima');
        });
});

/**
 * Inicia el bot.
 */
bot.launch();
