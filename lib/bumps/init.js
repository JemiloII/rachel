const config = require('config');
const logger = require('../common/logger');
const {add, help, test} = require('./commands');
const {load, schedule, updateBump} = require('./messages');

const init = client => {
    if (config.get('enable.bumps')) {
        logger.info('Loaded Bump Module');

        load(client, config.get('channels.bumps'))
            .then(() => logger.debug('Loaded available bump messages.'))
            .catch(error => logger.debug('Failed load available bump messages. Error:', error));

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
                    case command.startsWith('h'):
                    case command.startsWith('help'):
                    case command.startsWith('--help'):
                    default:
                        return help(message);
                }
            }
        });

        client.on('messageReactionAdd', (reaction, user) => {
            const channel = reaction.message.channel;
            const messageId = reaction.message.id;
            const memberId = user.id;

            if (channel.id !== config.get('channels.bumps')) {
                return;
            }

            if (reaction._emoji.name !== '✅') {
                return reaction.remove();
            }

            try {
                const bump = updateBump(channel, messageId, memberId);
                return schedule(bump);
            } catch (error) {
                logger.error('Failed to update server bump! Error:', error);
            }
        });
    }
};

module.exports = init;
