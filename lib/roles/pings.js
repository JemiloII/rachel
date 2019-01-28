const reactions = require('./reactions');

const roleMap = new Map([
    // emoji name, role name
    ['partyHard', 'events'],
    ['TwitchUnity', 'twitch'],
    ['ping', 'updates']
]);

const set = (reaction, userId) => reactions.set(roleMap, reaction, userId);

const remove = (reaction, userId) => reactions.remove(roleMap, reaction, userId);

module.exports = {
    remove,
    set
};
