const reactions = require('./reactions');

const colors = new Map([
    // emoji name, role name
    ['male', 'Male'],
    ['female', 'Female']
]);

const set = (reaction, userId) => reactions.set(colors, reaction, userId, true);

const remove = (reaction, userId) => reactions.remove(colors, reaction, userId);

module.exports = {
    remove,
    set
};
