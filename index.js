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

bot.on('message', async (message) => {
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
    console.log('add', reaction, user);

});

bot.on('messageReactionRemove', async (reaction, user) => {
    console.log('remove', reaction, user);
});

bot.login(config.get('token'))
    .catch(error => console.error('Failed to login!', error));