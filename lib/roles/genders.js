const roles = require('./index');
const reactions = require('./reactions');

const roleMap = new Map([
    // emoji name, role name
    ['male', 'Male'],
    ['female', 'Female']
]);

const set = (reaction, userId) => {
    roles.set(userId, 'Initiate Friends');
    roles.remove(userId, 'Initiates')
        .catch(() => console.log(userId, 'changed their gender'));
    return reactions.set(roleMap, reaction, userId, true);
};

const remove = (reaction, userId) => {
    roles.remove(userId, 'Initiate Friends');
    roles.set(userId, 'Initiates');
    return reactions.remove(roleMap, reaction, userId);
};

module.exports = {
    remove,
    set
};
