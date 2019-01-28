const reactions = require('./reactions');

const roles = new Map([
    // emoji name, role name
    ['single', 'Single'],
    ['taken', 'Taken'],
    ['looking', 'Looking'],
    ['not looking', 'Not Looking'],
    ['complicated', 'Complicated'],
    ['monogamous', 'monogamous'],
    ['polyamorous', 'polyamorous']
]);

const set = (reaction, userId) => reactions.set(roles, reaction, userId);

const remove = (reaction, userId) => reactions.remove(roles, reaction, userId);

module.exports = {
    remove,
    set
};
