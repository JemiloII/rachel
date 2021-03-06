const roles = require('./core');

const roleMap = new Map([
    // user input, role
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
    [`don't starve together`, `Don't Starve Together`],
    [`tetris`, `Tetris`],
    [`bns`, `Blade and Soul`],
    [`blade and soul`, `Blade and Soul`],
    [`eso`, `Elder Scrolls Online`],
    [`elder scrolls online`, `Elder Scrolls Online`],
    [`portal knights`, `Portal Knights`],
    [`path of exile`, `Path of Exile`],
    [`poe`, `Path of Exile`],
    ['wow', 'World of Warcraft'],
    ['world of warcraft', 'World of Warcraft'],
    ['vrchat', 'VRChat'],
    ['rainbow six siege', 'Rainbow Six Siege'],
    ['rss', 'Rainbow Six Siege'],
    ['runescape', 'RuneScape'],
    ['rs', 'RuneScape'],
    ['monster hunter', 'Monster Hunter'],
    ['mh', 'Monster Hunter'],
    ['super smash brothers ultimate', 'SSBU'],
    ['ssbu', 'SSBU'],
    [`diablo`, `Diablo`],
    ['roblox', 'Roblox'],
    [`terraria`, `Terraria`],
    ['osu', 'Osu!'],
    ['osu!', 'Osu!'],
    ['kindom hearts III', 'Kingdom Hearts'],
    ['kindom hearts 3', 'Kingdom Hearts'],
    ['kindom hearts', 'Kingdom Hearts'],
    ['kh3', 'Kingdom Hearts'],
    ['osu!', 'Osu!'],
    ['space engineer', 'Space Engineers'],
    ['civ5', 'Civ 5'],
    ['civ6', 'Civ 6'],
    ['civ', 'Civ 6'],
    ['civilization 5', 'Civ 6'],
    ['civilization 6', 'Civ 6'],
    ['civilization', 'Civ 6'],
    ['space engineers', 'Space Engineers']
]);

const list = [];
roleMap.forEach(value => {
    if (list.indexOf(value) === -1) {
        list.push(value);
    }
});

const getRole = message =>
    message.content.toLowerCase()
        .replace('game a ', '')
        .replace('game add ', '')
        .replace('game --add ', '')
        .replace('game r ', '')
        .replace('game remove ', '')
        .replace('game --remove ', '');

const add = message => {
    const guild = message.channel.guild;
    const role = getRole(message);
    const roleName = roleMap.get(role);
    if (roleName) {
        roles.set(message.author.id, roleName, guild);
        message.reply(`${roleName} added!`);
    } else {
        message.reply(`${role} does not exists!`);
    }
};

const help = message => {
    const text =
        `\n**Game Commands**
        　 add [game]
        　 help [game]
        　 remove [game]
        
         **Example**
           game --add league
         
         **Available Games**\n　-${list.join('\n　-')}`.replace(/ {8}/g, ''); // increase 8 if you change the tabbing
    return message.reply(text);
};

const remove = message => {
    const guild = message.channel.guild;
    const role = getRole(message);
    const roleName = roleMap.get(role);
    if (roleName) {
        roles.remove(message.author.id, roleName, guild);
        message.reply(`${roleName} removed!`);
    } else {
        message.reply(`${role} does not exists!`);
    }
};

module.exports = {
    add,
    help,
    remove
};
