const config = require('config');
const guildMemberAdd = require('./guildMemberAdd');
const guildMemberRemove = require('./guildMemberRemove');

const init = client => {
    if (process.env.NODE_ENV === 'production' || config.get('enable.registration')) {
        client.on('guildMemberAdd', guildMemberAdd);
        client.on('guildMemberRemove', guildMemberRemove);
    }
};

module.exports = init;
