const ages = require('./ages');
const colors = require('./colors');
const config = require('config');
const genders = require('./genders');
const logger = require('../common/logger.js');
const orientations = require('./orientations');
const pings = require('./pings');
const {roles: {age, color, gender, orientation, ping}, servers: {aoh}} = config;

const init = async client => {
    logger.debug('react-roles channel id:', config.get('channels.react-roles'));
    const channel = client.channels.get(config.get('channels.react-roles'));
    await channel.fetchMessage(age);
    await channel.fetchMessage(color);
    await channel.fetchMessage(gender);
    await channel.fetchMessage(orientation);
    await channel.fetchMessage(ping);

    client.on('messageReactionAdd', reactions('set'));
    client.on('messageReactionRemove', reactions('remove'));
};

// incase we want to remove instead of set
const inverse = action => action === 'set' ? 'remove' : 'set';

const reactions = action => (reaction, user) => {
    logger.debug(user.displayName, action, 'emoji:', reaction._emoji.name);
    switch(reaction.message.id) {
        case age:
            return ages[action](reaction, user.id);
        case color:
            return colors[action](reaction, user.id);
        case gender:
            return genders[action](reaction, user.id);
        case orientation:
            return orientations[action](reaction, user.id);
        case ping:
            return pings[inverse(action)](reaction, user.id);
        default:
            return void 0;
    }
};

module.exports = {
    init
};
