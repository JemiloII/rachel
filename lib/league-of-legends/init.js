const champions = require('./champions');
const {link, register} = require('./accounts');
const {cleanup} = require('../common/helpMenu');

const help = (message, countdown = 15) => {
    const text =
        `\n**League Commands**
        　\`help\`
        　　- Shows this menu
        
        　\`champion [name]\`
        　　- Currently gives basic lore of a champion.
        　　　ex) league champion lux
        
        　\`link [region] [name]\`
        　　- Uses Phreak on North America
        　　　ex) league link na Phreak
        　　- Uses your account linked with discord:
        　　　ex) league link
        `.replace(/ {8}/g, ''); // increase 8 if you change the tabs
    const updatedText = text.concat(`\nRemoving menu in ${countdown} seconds`);
    message.delete();
    return message.reply(updatedText)
        .then(sent => cleanup(message.author, sent, countdown, text));
};

const init = client => {
    client.on('message', async message => {
        const channelName = message.channel.name;
        if (channelName !== 'game-roles' && channelName !== 'League of Legends') {
            return;
        }

        if (message.content.toLowerCase().startsWith('league ')) {
            const command = message.content.replace(/league\s/i, '');

            let input;
            switch (true) {
                case command.startsWith('h'):
                case command.startsWith('help'):
                    return help(message);
                case command.startsWith('c '):
                case command.startsWith('champ '):
                case command.startsWith('champion '):
                    input = command.replace(/(champion|champ|c)(\s*)/, '');
                    return champions.info(message, input);
                case command.startsWith('l'):
                case command.startsWith('link'):
                    input = command.replace(/(link|l)(\s*)/, '');
                    return link(message, input);
                default:
                    return;
            }
        }

        if (message.author.username === '🎄Xmas Shibi🎄' && message.content === 'a') {
            message.delete();
            registerAccount(message.member, message.guild);
        }
    });

    client.on('guildMemberAdd', member => setTimeout(register, 1000, member));
};

module.exports = init;
