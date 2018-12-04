const bible = require('./lib/bible');
const config = require('config');
const colors = require('./lib/roles/colors');
const Discord = require('discord.js');
const ages = require('./lib/roles/ages');
const games = require('./lib/roles/games');
const genders = require('./lib/roles/genders');
const orientations = require('./lib/roles/orientations');
const roles = require('./lib/roles');
const bot = new Discord.Client({disableEveryone: true});
bible.setClient(bot);

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    try {
        let link = await bot.generateInvite(['ADMINISTRATOR']);
        console.log('link:', link);
        const channel = bot.channels.get('510082804655063060');
        await channel.fetchMessage(roles.age);
        await channel.fetchMessage(roles.color);
        await channel.fetchMessage(roles.gender);
        await channel.fetchMessage(roles.orientation);

        roles.init(bot);
    } catch (e) {
        console.error(e);
    }
});

const handleMessage = async (message) => {
    const {author, channel, content} = message;
    if (author.bot) {
        return;
    }

    console.log(channel.name);
    console.log(`${author.username}: ${content}`);

    switch(true) {
        case content.toLowerCase() === 'rachel bot is a real person':
            console.log(`${bot.user.username}: 😉`);
            return setTimeout(() => message.reply('😉'), 3000);
        case content.toLowerCase() === 'ping':
            console.log(`${bot.user.username}: pong`);
            return message.reply('pong');
        case content.startsWith('--verse'):
        case content.startsWith('bible --text'):
            return bible.sendVerse(message);
        case content.startsWith('bible --audio'):
            return bible.playAudio(message);
        case content.startsWith('game add '):
        case content.startsWith('game --add '):
            return games.add(message);
        case content.startsWith('game help'):
        case content.startsWith('game --help'):
            return games.help(message);
        case content.startsWith('game remove '):
        case content.startsWith('game --remove '):
            return games.remove(message);
        default:
            return void 0;
    }
};

bot.on('message', handleMessage);
bot.on('messageUpdate', handleMessage);

const reactions = action => (reaction, user) => {
    console.log(action, 'emoji:', reaction._emoji.name);
    switch(reaction.message.id) {
        case roles.age:
            return ages[action](reaction, user.id);
        case roles.color:
            return colors[action](reaction, user.id);
        case roles.gender:
            return genders[action](reaction, user.id);
        case roles.orientation:
            return orientations[action](reaction, user.id);
        default:
            return void 0;
    }
};

bot.on('messageReactionAdd', reactions('set'));
bot.on('messageReactionRemove', reactions('remove'));

bot.on('guildMemberAdd', async member => {
    const GeneralChannel = member.guild.channels.find(ch => ch.name === 'general');
    const Initiates = member.guild.roles.find(info => info.name === 'Initiate Friends');
    const InitiateFriends = member.guild.roles.find(info => info.name === 'Initiates');
    await member.addRoles([Initiates, InitiateFriends]);
    GeneralChannel.send(`${member} <@&516746746764722177> to Angels of Heaven!\nMake sure to set your <#510082804655063060> and enjoy your time here!`);
});

bot.on('guildMemberRemove', async member => {
    const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'registration-room');
    RegistrationRoom.send(`${member} has left.`);
});

bot.on('error', console.error);

bot.login(config.get('discord.token'))
    .catch(error => console.error('Failed to login!', error));

process.on('uncaughtException', error => console.log('Caught exception:', error));
