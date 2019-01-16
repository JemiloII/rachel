const {Channels} = require('./models');

const fetchMessages = client =>
    Channels.fetchAll({withRelated: 'messages'})
        .then(channels => channels.toJSON())
        .each(channel => {
            const textChannel = client.channels.get(channel.id);
            channel.messages.forEach(async message => await textChannel.fetchMessage(message.id));
        });

module.exports = {
    fetchMessages
};
