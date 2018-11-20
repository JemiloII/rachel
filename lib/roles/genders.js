const reactions = require('./reactions');

const roles = new Map([
    // emoji name, role name
    ['male', 'Male'],
    ['female', 'Female']
]);

const set = (reaction, userId) => reactions.set(roles, reaction, userId, true);

const remove = (reaction, userId) => reactions.remove(roles, reaction, userId);

module.exports = {
    remove,
    set
};
