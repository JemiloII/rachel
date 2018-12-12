const guildMemberAdd = require('./guildMemberAdd');
const guildMemberRemove = require('./guildMemberRemove');

const init = client => {
    client.on('guildMemberAdd', guildMemberAdd);

    client.on('guildMemberRemove', guildMemberRemove);
};

module.exports = init;
