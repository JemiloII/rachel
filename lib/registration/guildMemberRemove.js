const {GuildMembers} = require('./models');

const guildMemberRemove = member => {
    const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'joins-leaves');
    RegistrationRoom.send(`${member.displayName} has left.`);
    GuildMembers.where({id: member.id}).fetch()
        .then(({messageId}) => {
            const GeneralChannel = member.guild.channels.get('general');
            GeneralChannel.fetchMessage(messageId).delete();
        });
};

module.exports = guildMemberRemove;
