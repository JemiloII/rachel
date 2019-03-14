const config = require('config');
const logger = require('../common/logger');

const wants8bitCompose = guild => {
    const roleId = guild.roles.find(r => r.name === '8bit').id;
    return userId => guild.member(userId).roles.get(roleId);
};

const init = (client) => {
    if (config.get('enable.lowBitRate')) {
        logger.info('Loaded LowBitRate Module');

        client.on('voiceStateUpdate', (o, n) => {
            const wants8bit = wants8bitCompose(n.guild);
            if (n.voiceChannelID && wants8bit(n.user.id)) {
                client.channels.get(n.voiceChannelID).setBitrate(8, '8bit user joined!');
            }

            if (o.voiceChannelID && !client.channels.get(o.voiceChannelID).members.some(wants8bit)) {
                client.channels.get(o.voiceChannelID).setBitrate(64, '8bit user left!');
            }
        });
    }
};

module.exports = {
    init
};
