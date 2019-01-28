const config = require('config');
const guildMemberAdd = require('./guildMemberAdd');
const guildMemberRemove = require('./guildMemberRemove');

const init = client => {
    if (config.get('enable.registration')) {
        client.on('guildMemberAdd', guildMemberAdd);
        client.on('guildMemberRemove', guildMemberRemove);
    }
};

module.exports = init;
