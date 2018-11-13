const config = require('config');
const {roles: {color}, servers: {aoh}} = config;
let bot, guild;

const get = name => guild.roles.find(role => role.name === name);

const init = client => {
    bot = client;
    guild = bot.guilds.get(aoh);
};

const set = (userId, name) => {
    const member = guild.members.get(userId);
    const role = get(name);
    return member.addRole(role);
};

const remove = (userId, name) => {
    const member = guild.members.get(userId);
    const role = get(name);
    return member.removeRole(role);
};

module.exports = {
    color,
    init,
    remove,
    set
};