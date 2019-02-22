const {GuildMembers} = require('./models');
const logger = require('../common/logger');

const guildMemberRemove = member => {
    const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'joins-leaves');
    logger.debug(`${member.displayName} has left.`);
    RegistrationRoom.send(`${member.displayName} has left.`);
    return GuildMembers.where({id: member.id}).fetch()
        .then(({messageId}) => {
            logger.debug(`Deleting welcome message for ${member.displayName}.`);
            try {
                const GeneralChannel = member.guild.channels.get('general');
                return GeneralChannel.fetchMessage(messageId).delete();
            } catch (error) {
                logger.error(`Could not delete welcome message for ${member.username} with id ${member.id} error: ${error.message}`);
            }
        })
        .catch(logger.error);
};

module.exports = guildMemberRemove;
