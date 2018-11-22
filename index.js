const bible = require('./lib/bible');
const config = require('config');
const colors = require('./lib/roles/colors');
const Discord = require('discord.js');
const games = require('./lib/roles/games');
const genders = require('./lib/roles/genders');
const roles = require('./lib/roles');
const bot = new Discord.Client({disableEveryone: true});
bible.setClient(bot);

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    try {
        let link = await bot.generateInvite(['ADMINISTRATOR']);
        console.log('link:', link);
        const channel = bot.channels.get('510082804655063060');
        await channel.fetchMessage(roles.color);
        await channel.fetchMessage(roles.gender);

        roles.init(bot);
    } catch (e) {
        console.error(e);
    }
});

bot.on('message', async (message) => {
    const {author, channel, content} = message;
    if (author.bot) {
        return;
    }

    console.log(channel.name);
    console.log(`${author.username}: ${content}`);

    switch(true) {
        case content.toLowerCase() === 'ping':
            console.log(`${bot.user.username}: pong`);
            return message.reply('pong');
        case content.startsWith('--verse'):
        case content.startsWith('bible --text'):
            return bible.sendVerse(message);
        case content.startsWith('bible --audio'):
            return bible.playAudio(message);
        case content.startsWith('game --add '):
            return games.add(message);
        case content.startsWith('game --set '):
            return games.remove(message);
        default:
            return void 0;
    }

});

bot.on('messageReactionAdd', (reaction, user) => {
    console.log('emoji:', reaction._emoji.name);
    if (reaction.message.id === roles.color) {
        colors.set(reaction, user.id)
    }

    if (reaction.message.id === roles.gender) {
        genders.set(reaction, user.id);
    }
});

bot.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.id === roles.color) {
        colors.remove(reaction, user.id);
    }

    if (reaction.message.id === roles.gender) {
        genders.remove(reaction, user.id);
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
