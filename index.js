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

const sendEmbed = (member) => {
    const GeneralChannel = member.guild.channels.find(ch => ch.name === 'general');
    const embed = {
        "title": `Welcome ${member.displayName} to Angels of Heaven!`,
        "description": `<@&516746746764722177> ${member}! Make sure to set your <#510082804655063060> and introduce yourself in <#517562086310674435> channel! You can use <#511301471690555407> to assign game roles.`,
        "color": 5046016,
        "thumbnail": {
            "url": "https://i.gifer.com/3iCH.gif"
        },
        "image": {
            "url": "https://orig00.deviantart.net/31ee/f/2016/202/3/a/kirino_gif_494x694_by_artemsan15-daaup2t.gif"
        }
    };
    GeneralChannel.send({embed});
};

const handleMessage = async (message, messageUpdate = false) => {
    message = messageUpdate || message;
    const {author, channel, content} = message;
    if (author.bot) {
        return;
    }

    console.log(channel.name);
    console.log(`${author.username}: ${content}`);

    switch(true) {
        case content.toLowerCase() === 'test':
            return sendEmbed(message.member);
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
    const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'registration-room');
    const Initiates = member.guild.roles.find(info => info.name === 'Initiate Friends');
    const InitiateFriends = member.guild.roles.find(info => info.name === 'Initiates');
    await member.addRoles([Initiates, InitiateFriends]);
    RegistrationRoom.send(`${member.displayName} has joined.`);
    sendEmbed(member);
});

bot.on('guildMemberRemove', async member => {
    const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'registration-room');
    RegistrationRoom.send(`${member.displayName} has left.`);
});

bot.on('error', console.error);

bot.login(config.get('discord.token'))
    .catch(error => console.error('Failed to login!', error));

process.on('uncaughtException', error => console.log('Caught exception:', error));
