const bible = require('./lib/bible');
const config = require('config');
const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true});

bible.setClient(bot);

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

    if (message.content.startsWith('--verse')) {
        bible.sendVerse(message);
    }

});

bot.on('messageReactionAdd', (reaction, user) => {
    console.log('add', reaction, user);
});

bot.on('messageReactionRemove', (reaction, user) => {
    console.log('remove', reaction, user);
});

bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'registration-room');
    if (channel) {
        channel.send(`Welcome to the server, ${member}`);
    }
});

bot.login(config.get('discord.token'))
    .catch(error => console.error('Failed to login!', error));