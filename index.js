const bible = require('./lib/bible');
const config = require('config');
const colors = require('./lib/roles/colors');
const Discord = require('discord.js');
const ages = require('./lib/roles/ages');
const games = require('./lib/roles/games');
const genders = require('./lib/roles/genders');
const orientations = require('./lib/roles/orientations');
const roles = require('./lib/roles');
const LeagueOfLegends = require('./lib/league-of-legends');

const client = new Discord.Client({disableEveryone: true});
bible.setClient(client);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        let link = await client.generateInvite(['ADMINISTRATOR']);
        console.log('link:', link);
        const channel = client.channels.get('510082804655063060');
        await channel.fetchMessage(roles.age);
        await channel.fetchMessage(roles.color);
        await channel.fetchMessage(roles.gender);
        await channel.fetchMessage(roles.orientation);

        new LeagueOfLegends(client);
        roles.init(client);
    } catch (e) {
        console.error(e);
    }
});

const handleMessage = async (message, messageUpdate = false) => {
    message = messageUpdate || message;
    const {author, channel, content} = message;
    if (author.client) {
        return;
    }

    console.log(channel.name);
    console.log(`${author.username}: ${content}`);

    switch(true) {
        case content.toLowerCase() === 'rachel bot is a real person':
            console.log(`${client.user.username}: 😉`);
            message.startTyping(1);
            return setTimeout(() => {
                message.stopTyping();
                message.reply('You can think that~ 😉');
            }, 3000);
        case content.toLowerCase() === 'ping':
            console.log(`${client.user.username}: pong`);
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

// client.on('message', handleMessage);
// client.on('messageUpdate', handleMessage);

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

// client.on('messageReactionAdd', reactions('set'));
// client.on('messageReactionRemove', reactions('remove'));

client.on('error', console.error);

client.login(config.get('discord.token'))
    .catch(error => console.error('Failed to login!', error));

process.on('uncaughtException', error => console.log('Caught exception:', error));
