const reactions = require('./reactions');
const roles = require('./core');

const roleMap = new Map([
    // emoji name, role name
    ['male', 'Male'],
    ['female', 'Female']
]);

const set = (reaction, userId) => {
    const guild = reaction.message.channel.guild;
    const isFriend = guild.members.get(userId).roles.find(role => role.name === 'Friends');
    if (!isFriend) {
        roles.set(userId, 'Acquaintances', guild);
        roles.remove(userId, 'Missing Roles', guild)
            .catch(() => console.log(userId, 'changed their gender'));
    }
    return reactions.set(roleMap, reaction, userId, true);
};

const remove = (reaction, userId) => {
    const guild = reaction.message.channel.guild;
    const isFriend = guild.members.get(userId).roles.find(role => role.name === 'Friends');
    if (!isFriend) {
        roles.remove(userId, 'Acquaintances', guild);
        roles.set(userId, 'Missing Roles', guild);
    }
    return reactions.remove(roleMap, reaction, userId);
};

module.exports = {
    remove,
    set
};
