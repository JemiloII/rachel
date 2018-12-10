const champions = require('./champions');
const {registerAccount} = require('./accounts');

const init = client => {
    client.on('message', async message => {
        if (message.content.startsWith('League ') || message.content.startsWith('league ')) {
            const command = message.content.replace(/league /i, '');
            switch (true) {
                case command.startsWith('c '):
                case command.startsWith('champ '):
                case command.startsWith('champion '):
                    const champ = command.replace(/champion|champ|c/, '');
                    return champions.info(message, champ);
                default:
                    return;
            }
        }
    });

    client.on('guildMemberAdd', registerAccount);

    client.on('message', (message) => {
        if (message.author.username === '🎄Xmas Shibi🎄' && message.content === 'a') {
            message.delete();
            registerAccount(message.member);
        }
    });
};

module.exports = init;
