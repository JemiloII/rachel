const reactions = require('./reactions');

const roles = new Map([
    // emoji name, role name
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

const set = (reaction, userId) => reactions.set(roles, reaction, userId);

const remove = (reaction, userId) => reactions.remove(roles, reaction, userId);

module.exports = {
    remove,
    set
};
