const reactions = require('./reactions');

const roleMap = new Map([
    // emoji name, role name
    ['male', 'Male'],
    ['female', 'Female']
]);

const set = (reaction, userId) => {
    const guild = reaction.message.channel.guild;
    roles.set(userId, 'Initiate Friends', guild);
    roles.remove(userId, 'Initiates', guild)
        .catch(() => console.log(userId, 'changed their gender'));
    return reactions.set(roleMap, reaction, userId, true);
};

const remove = (reaction, userId) => {
    const guild = reaction.message.channel.guild;
    roles.remove(userId, 'Initiate Friends', guild);
    roles.set(userId, 'Initiates', guild);
    return reactions.remove(roleMap, reaction, userId);
};

module.exports = {
    remove,
    set
};
