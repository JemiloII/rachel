const bible = require('./lib/bible');
const bumps = require('./lib/bumps');
const config = require('config');
const Discord = require('discord.js');
const games = require('./lib/roles/games');
const logger = require('./lib/common/logger');
const registration = require('./lib/registration');
const roles = require('./lib/roles/init');
const prompt = require('./lib/prompt');
const LeagueOfLegends = require('./lib/league-of-legends');

const client = new Discord.Client({disableEveryone: true});
bible.setClient(client);

client.on('ready', async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    try {
        let link = await client.generateInvite(['ADMINISTRATOR']);
        logger.debug('link:', link);

        LeagueOfLegends.init(client);
        prompt.init(client);
        registration.init(client);
        roles.init(client);
        bumps.init(client);
    } catch (e) {
        logger.error(e);
    }
});

const handleMessage = async (message, messageUpdate = false) => {
    message = messageUpdate || message;
    const {author, channel, content} = message;
    if (author.bot) {
        return;
    }

    logger.debug(`${channel.name}| ${author.username}: ${content}`);

    switch(true) {
        case content.toLowerCase() === 'i love rachel':
            return message.reply(':heart: :heart: :heart:');
        case content.toLowerCase() === 'rachel is a real person':
        case content.toLowerCase() === 'i think rachel is a real person':
        case content.toLowerCase() === 'i think rachel bot is a real person':
        case content.toLowerCase() === 'rachel bot is a real person':
            logger.verbose(`Rachel: 😉`);
            return message.reply('You can think that~ 😉');
        case content.toLowerCase() === 'hi shibi':
        case content.toLowerCase() === 'hi matt':
        case content.toLowerCase() === 'hi kuri':
        case content.toLowerCase() === 'hi jayxd':
            return message.channel.send(content);
        case content.toLowerCase() === 'ping':
            logger.verbose(`Rachel: pong`);
            return message.reply('pong');
        case content.startsWith('bible h '):
        case content.startsWith('bible help '):
        case content.startsWith('bible --help '):
            return bible.help();
        case content.startsWith('--verse'):
        case content.startsWith('bible t '):
        case content.startsWith('bible text '):
        case content.startsWith('bible --text '):
            return bible.sendVerse(message);
        case content.startsWith('bible a '):
        case content.startsWith('bible audio '):
        case content.startsWith('bible --audio '):
            return bible.playAudio(message);
        case content.startsWith('game a '):
        case content.startsWith('game add '):
        case content.startsWith('game --add '):
            return games.add(message);
        case content.startsWith('game h'):
        case content.startsWith('game help'):
        case content.startsWith('game --help'):
            return games.help(message);
        case content.startsWith('game r '):
        case content.startsWith('game remove '):
        case content.startsWith('game --remove '):
            return games.remove(message);
        default:
            return void 0;
    }
};

client.on('message', handleMessage);
client.on('messageUpdate', handleMessage);

client.on('error', logger.error);

client.login(config.get('discord.token'))
    .catch(error => logger.error('Failed to login!', error));

process.on('uncaughtException', error => logger.error('Caught exception:', error));
