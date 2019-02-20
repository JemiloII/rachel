const init = require('./init');
const logger = require('../common/logger.js');

const remove = (userId, name, guild) => {
    logger.verbose(`Removing role ${name} for user ${userId}`);
    const member = guild.members.get(userId);
    const role = guild.roles.find(role => role.name === name);
    return member.removeRole(role);
};

const set = (userId, name, guild) => {
    logger.verbose(`Setting role ${name} for user ${userId}`);
    const member = guild.members.get(userId);
    const role = guild.roles.find(role => role.name === name);
    return member.addRole(role);
};

module.exports = {
    init,
    remove,
    set
};
