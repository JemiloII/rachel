const config = require('config');
const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true});

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    try {
        let link = await bot.generateInvite(['ADMINISTRATOR']);
        console.log('link:', link);
    } catch (e) {
        console.error(e);
    }
});

bot.on('message', async (reaction, user) => {
    if (message.author.bot) {
        return;
    }

    console.log(message.channel.name);
    console.log(`${message.author.username}: ${message.content}`);

    if (message.content === 'ping') {
        message.reply('Pong!');
        console.log(`${bot.user.username}: Pong!`);
    }
});

bot.on('messageReactionAdd', async (reaction, user) => {
    console.log('called');

});

bot.on('messageReactionRemove', async reaction => {
    console.log('called');
    if (reaction.author.bot) {
        return;
    }

    console.log(reaction.channel.name);
    console.log(`${reaction.author.username}: ${reaction.content}`);

    if (reaction.content === 'ping') {
        reaction.reply('Pong!');
        console.log(`${bot.user.username}: Pong!`);
    }
});

bot.login(config.get('token'));