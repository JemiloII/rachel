const config = require('config');
const RoleMethods = require('./lib/roles/genders');

const massAddRoles = (guild, rolesArray) =>
    guild.fetchMembers()
        .then(({members}) => {
            console.log(typeof members);
            return members;
        })
        .then(members => members.forEach(member => {
            console.log(`Setting role for ${member.user.username}#${member.user.discriminator}`);
            try {
                member.addRoles(rolesArray);
            } catch (e) {}
            // return member.setRoles(rolesArray)
        }))
        .then(() => console.log('Complete!'))
        .catch(error => console.log('i haz error:', error));

const massRemoveRoles = (guild, rolesArray) =>
    guild.fetchMembers()
        .then(({members}) => {
            console.log(typeof members);
            return members;
        })
        .then(members => members.forEach(member => {
            console.log(`Setting role for ${member.user.username}#${member.user.discriminator}`);
            try {
                member.removeRoles(rolesArray);
            } catch (e) {}
            // return member.setRoles(rolesArray)
        }))
        .then(() => console.log('Complete!'))
        .catch(error => console.log('i haz error:', error));



module.exports = async (client) => {
    console.log('Loaded Temp');
    const reactRoles = config.get('channels.react-roles');
    const {roles: {age, color, gender, orientation, ping}} = config;
    const guild = client.guilds.get(config.get('servers.aoh'));
    const channel = guild.channels.get(reactRoles);
    let Message;

    // Message = await channel.fetchMessage(gender);
    // Message
    //     .reactions.forEach(async reaction => {
    //         const users = await reaction.fetchUsers({limit: 100});
    //         users.forEach(user => {
    //
    //             try {
    //                 RoleMethods.set(reaction, user.id);
    //                 console.log('Success! role from emoji:', reaction._emoji.name, 'for user:', user.username);
    //             } catch (e) {
    //                 console.log('Failure! role from emoji:', reaction._emoji.name, 'for user:', user.username);
    //             }
    //         });
    //     });

    const roles = {
        events: '533142769992990730',
        twitch: '533143157328838677',
        updates: '533142937421348875',
        about: '517154372724195330',
        games: '517154224979836939',
        pings: '539497041231872020',
        friends: '411642171800944650'
    };

    const rolesArray = Object.values(roles);
    // massRemoveRoles(guild, ['518248472978128897', '411647640510660609']);
};
