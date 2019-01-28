const config = require('config');
const guildMemberAdd = require('./guildMemberAdd');
const guildMemberRemove = require('./guildMemberRemove');
const logger = require('../common/logger');

const init = client => {
    if (config.get('enable.registration')) {
        logger.info('Loaded registration module');
        client.on('guildMemberAdd', guildMemberAdd);
        client.on('guildMemberRemove', guildMemberRemove);
    }
};

module.exports = init;
