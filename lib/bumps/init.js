const {add, test} = require('./commands');
const config = require('config');
const logger = require('../common/logger');

const help = (message, countdown = 15) => {
    const text =
        `\n**Bump Commands**
        　\`help\`
        　　- Shows this menu
        
        　\`add [website] [hours] [username] [password]\`
        　　- Adds a new discord bump server
        　　　ex) add discord.me 6 Shibiko AnG31_2019%
        
        　\`update [website] [hours] ([username] [password])\`
        　　- Updates an existing discord bump server
        　　　ex) update discord.me 6 Shibiko AnG31_2019%
        
        　\`manual [website] [hours] [username] [password]\`
        　　- Updates an existing discord bump server
        　　　ex) update discord.me 6 Shibiko AnG31_2019%
        `.replace(/ {8}/g, ''); // increase 8 if you change the tabs
    const updatedText = text.concat(`\nRemoving menu in ${countdown} seconds`);
    message.delete();
    return message.reply(updatedText)
        .then(sent => cleanup(message.author, sent, countdown, text));
};

const init = client => {
    if (config.get('enable.bumps')) {
        logger.info('Loaded Bump Module');
        client.on('message', message => {
            if (message.channel.id !== config.get('channels.bumps')) {
                return;
            }

            if (message.content.startsWith('bump ')) {
                const command = message.content.replace(/bump\s/i, '');

                let input;
                switch (true) {
                    case command.startsWith('t '):
                    case command.startsWith('test '):
                        input = command.replace(/(test|t)(\s*)/, '');
                        return test(message, input);
                    case command.startsWith('a '):
                    case command.startsWith('add '):
                    case command.startsWith('--add '):
                        input = command.replace(/(--add|add|a)(\s*)/, '');
                        return add(message, input);
                    case command.startsWith('u '):
                    case command.startsWith('update '):
                    case command.startsWith('--update '):
                        input = command.replace(/(--update|update|u)(\s*)/, '');
                        return update(message, input);
                    case command.startsWith('m '):
                    case command.startsWith('manual '):
                    case command.startsWith('--manual '):
                    case command.startsWith('f '):
                    case command.startsWith('force '):
                    case command.startsWith('--force '):
                        input = command.replace(/(--manual|manual|m|--force|force|f)(\s*)/, '');
                        return manual(message, input);
                    case command.startsWith('h'):
                    case command.startsWith('help'):
                    case command.startsWith('--help'):
                    default:
                        return help(message);
                }
            }
        });
    }
};

module.exports = init;
