const config = require('config');
const logger = require('../common/logger.js');
const util = require('util');
const {servers: {aoh}} = config;

let channel;

const switchChannel = (client, name) => {
    const guild = client.guilds.get(aoh);
    channel = guild.channels.find(channel => channel.name === name);
    logger.debug('Switching to channel:', channel.name);
    return channel;
};

const listener = client => text => {
    logger.verbose('received data:', util.inspect(text));

    switch (true) {
        case text.startsWith('/channel'):
            const name = text.replace(/\/channel |\n/g, '');
            return switchChannel(client, name);
        default:
            return channel.send(text);
    }
};

const init = client => {
    if (process.env.NODE_ENV === 'development') {
        switchChannel(client, 'general');

        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', listener(client));
    }
};

module.exports = {
    init
};
