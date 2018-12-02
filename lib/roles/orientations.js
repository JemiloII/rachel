const reactions = require('./reactions');

const roles = new Map([
    // emoji name, role name
    ['straight', 'Straight'],
    ['bisexual', 'Bisexual'],
    ['gay', 'Gay'],
    ['lesbian', 'Lesbian'],
    ['pansexual', 'Pansexual'],
    ['nonbinary', 'Nonbinary'],
    ['agender', 'Agender'],
    ['asexual', 'Asexual']
]);

const set = (reaction, userId) => reactions.set(roles, reaction, userId, true);

const remove = (reaction, userId) => reactions.remove(roles, reaction, userId);

module.exports = {
    remove,
    set
};
