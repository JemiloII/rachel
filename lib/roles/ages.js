const reactions = require('./reactions');

// emoji name, role name
const roles = new Map([
    ['dash', '-14'],
    ['15', '15'],
    ['16', '16'],
    ['17', '17'],
    ['18', '18'],
    ['19', '19'],
    ['20', '20'],
    ['21', '21'],
    ['22', '22'],
    ['23', '23'],
    ['24', '24'],
    ['25', '25'],
    ['26', '26'],
    ['27', '27'],
    ['28', '28'],
    ['29', '29'],
    ['30', '30'],
    ['plus', '31+']
]);

const set = (reaction, userId) => reactions.set(roles, reaction, userId, true);

const remove = (reaction, userId) => reactions.remove(roles, reaction, userId);

module.exports = {
    remove,
    set
};
