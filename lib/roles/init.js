const {Channels} = require('./models');

const init = bot =>
    Channels.fetchAll({withRelated: 'messages'})
        .then(channels => {
            return channels.toJSON()
        })
        .each(channel => {
            const textChannel = bot.channels.get(channel.id);
            channel.messages.forEach(async message => await textChannel.fetchMessage(message.id));
        });

module.exports = init;
