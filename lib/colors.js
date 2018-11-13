const roles = require('./roles');

const colors = new Map([
    ['🔶', 'Orange'],
    ['🔴', 'Red'],
    ['⚫', 'Black'],
    ['⚪', 'White'],
    ['🔵', 'Blue'],
    ['💛', 'Yellow'],
    ['💚', 'Green'],
    ['💜', 'Purple'],
    ['💗', 'Pink']
]);

const set = (reaction, userId) => {
    const emoji = reaction._emoji.name;
    const roleName = colors.get(emoji);
    return roleName ? roles.set(userId, roleName) : reaction.remove(userId);
};

const remove = (reaction, userId) => {
    const emoji = reaction._emoji.name;
    const roleName = colors.get(emoji);
    return roles.remove(userId, roleName);
};


module.exports = {
    remove,
    set
};