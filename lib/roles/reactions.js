const roles = require('./index');

const clear = (roleMap, reaction, userId) => {
    roleMap.forEach(role => roles.remove(userId, role));
    reaction.message.reactions
        .filter(messageReaction => reaction._emoji.name !== messageReaction._emoji.name)
        .forEach(messageReaction => {
            try {
                messageReaction.remove(userId)
            } catch (e) {}
        });
};

const set = async (roleMap, reaction, userId, singleRole) => {
    if (singleRole) {
        await clear(roleMap, reaction, userId);
    }

    const emoji = reaction._emoji.name;
    const roleName = roleMap.get(emoji);
    return roleName ? roles.set(userId, roleName) : reaction.remove(userId);
};

const remove = (roleMap, reaction, userId) => {
    const emoji = reaction._emoji.name;
    const roleName = roleMap.get(emoji);
    return roles.remove(userId, roleName);
};


module.exports = {
    remove,
    set
};
