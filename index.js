const bible = require('./lib/bible');
const config = require('config');
const Discord = require('discord.js');
const roles = require('./lib/roles');
const bot = new Discord.Client({disableEveryone: true});
bible.setClient(bot);

const {servers} = config;

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    try {
        let link = await bot.generateInvite(['ADMINISTRATOR']);
        console.log('link:', link);
        const channel = bot.channels.get('510082804655063060');
        await channel.fetchMessage(roles.color);

        roles.init(bot);
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
    console.log('Reaction Added');
    if (reaction.message.id === roles.color) {
        switch (reaction._emoji.name) {
            case '🔶':
                return roles.set(user.id, 'Orange');
            case '🔴':
                return roles.set(user.id, 'Red');
            case '⚫':
                return roles.set(user.id, 'Black');
            case '⚪':
                return roles.set(user.id, 'White');
            case '🔵':
                return roles.set(user.id, 'Blue');
            case '💛':
                return roles.set(user.id, 'Yellow');
            case '💚':
                return roles.set(user.id, 'Green');
            case '💜':
                return roles.set(user.id, 'Purple');
            case '💗':
                return roles.set(user.id, 'Pink');
            default:
                return reaction.remove(user.id);
        }
    }
});

bot.on('messageReactionRemove', (reaction, user) => {
    console.log('Reaction Removed');
    if (reaction.message.id === roles.color) {
        switch (reaction._emoji.name) {
            case '🔶':
                return roles.remove(user.id, 'Orange');
            case '🔴':
                return roles.remove(user.id, 'Red');
            case '⚫':
                return roles.remove(user.id, 'Black');
            case '⚪':
                return roles.remove(user.id, 'White');
            case '🔵':
                return roles.remove(user.id, 'Blue');
            case '💛':
                return roles.remove(user.id, 'Yellow');
            case '💚':
                return roles.remove(user.id, 'Green');
            case '💜':
                return roles.remove(user.id, 'Purple');
            case '💗':
                return roles.remove(user.id, 'Pink');
            default:
                return;
        }
    }
});

bot.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.find(ch => ch.name === 'registration-room');
    if (channel) {
        const role = member.guild.roles.find('name', 'Initiate Friends');
        await member.addRole(role);
        channel.reply(`Welcome to the server, ${member}`);
    }
});

bot.login(config.get('discord.token'))
    .catch(error => console.error('Failed to login!', error));