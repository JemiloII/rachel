const roles = require('./index');

const roleMap = new Map([
    ['league of legends', 'League'],
    ['league', 'League'],
    ['lol', 'League'],
    ['scbw', 'SCBW'],
    ['starcraft broodwar', 'SCBW'],
    ['sc2', 'SC2'],
    ['starcraft', 'SC2'],
    ['starcraft2', 'SC2'],
    ['starcraft 2', 'SC2'],
    ['pubg', 'PUBG'],
    ['player unknown', 'PUBG'],
    ['player unknown battle grounds', 'PUBG'],
    ['wc3', 'WC3'],
    ['warcraft', 'WC3'],
    ['warcraft 3', 'WC3'],
    ['fortnite', 'FortNite'],
    ['mc', 'Minecraft'],
    ['minecraft', 'Minecraft'],
    ['dota2', 'Dota2'],
    ['dota 2', 'Dota2'],
    ['overwatch', 'OverWatch'],
    ['bo4', 'Black Ops 4'],
    ['blackops4', 'Black Ops 4'],
    ['black ops 4', 'Black Ops 4'],
    ['cod', 'Black Ops 4'],
    ['cod4', 'Black Ops 4'],
    ['cod 4', 'Black Ops 4'],
    ['black ops', 'Black Ops 4'],
    ['black ops 4', 'Black Ops 4'],
    ['dst', `Don't Starve Together`],
    [`don't starve`, `Don't Starve Together`],
    [`don't starve together`, `Don't Starve Together`]
]);

const list = [];
roleMap.forEach((value, keys) => {
    if (list.indexOf(value) === -1) {
        list.push(value);
    }
});

const getRole = message =>
    message.content.toLowerCase()
        .replace('game --add ', '')
        .replace('game --remove ');

const add = message => {
    const role = getRole(message);
    const roleName = roleMap.get(role);
    return roles.set(message.author.id, roleName);
};

const help = message => {
    const text =
        `\n**Game Commands**
        　--add　　 
        　--help
        　--remove
        
         **Available Games**\n　-${list.join('\n　-')}
         
         **Example**
         game --add league`.replace(/ {8}/g, '');
    return message.reply(text);
};

const remove = message => {
    const role = getRole(message);
    const roleName = roleMap.get(role);
    return roles.remove(message.author.id, roleName);
};

module.exports = {
    add,
    help,
    remove
};
