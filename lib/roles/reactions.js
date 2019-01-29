const logger = require('../common/logger');
const roles = require('.');

const clear = (roleMap, reaction, userId, guild) => {
    logger.debug('roles:', roles);
    roleMap.forEach(role => roles.remove(userId, role, guild));
    reaction.message.reactions
        .filter(messageReaction => reaction._emoji.name !== messageReaction._emoji.name)
        .forEach(messageReaction => {
            try {
                messageReaction.remove(userId)
            } catch (e) {}
        });
};

const set = async (roleMap, reaction, userId, singleRole = false) => {
    const guild = reaction.message.channel.guild;
    if (singleRole) {
        await clear(roleMap, reaction, userId, guild);
    }

    const emoji = reaction._emoji.name;
    const roleName = roleMap.get(emoji);
    return roleName ? roles.set(userId, roleName, guild) : reaction.remove(userId);
};

const remove = (roleMap, reaction, userId) => {
    const emoji = reaction._emoji.name;
    const guild = reaction.message.channel.guild;
    const roleName = roleMap.get(emoji);
    return roles.remove(userId, roleName, guild);
};

module.exports = {
    remove,
    set
};
