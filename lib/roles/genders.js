const roles = require('./index');
const reactions = require('./reactions');

const roleMap = new Map([
    // emoji name, role name
    ['male', 'Male'],
    ['female', 'Female']
]);

const set = (reaction, userId) => {
    reactions.set(roleMap, reaction, userId, true);
    roles.set(userId, 'Initiate Friends');
    roles.remove(userId, 'Initiates')
        .catch(() => console.log(userId, 'changed their gender'));
};

const remove = (reaction, userId) => {
    reactions.remove(roleMap, reaction, userId);
    roles.remove(userId, 'Initiate Friends');
    roles.remove(userId, 'Initiates');
};

module.exports = {
    remove,
    set
};
