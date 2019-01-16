const ages = require('./ages');
const colors = require('./colors');
const config = require('config');
const genders = require('./genders');
const logger = require('../common/logger.js');
const orientations = require('./orientations');
const {roles: {age, color, gender, orientation}, servers: {aoh}} = config;
let guild;

const get = name => guild.roles.find(role => role.name === name);

const init = async client => {
    guild = client.guilds.get(aoh);

    const channel = client.channels.get(config.get('channels.react-roles'));
    await channel.fetchMessage(age);
    await channel.fetchMessage(color);
    await channel.fetchMessage(gender);
    await channel.fetchMessage(orientation);

    client.on('messageReactionAdd', reactions('set'));
    client.on('messageReactionRemove', reactions('remove'));
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

const reactions = action => (reaction, user) => {
    logger.debug(user.displayName, action, 'emoji:', reaction._emoji.name);
    switch(reaction.message.id) {
        case age:
            return ages[action](reaction, user.id);
        case color:
            return colors[action](reaction, user.id);
        case gender:
            return genders[action](reaction, user.id);
        case orientation:
            return orientations[action](reaction, user.id);
        default:
            return void 0;
    }
};

module.exports = {
    init,
    remove,
    set
};
