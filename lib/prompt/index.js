const config = require('config');
const util = require('util');
const {servers: {aoh}} = config;

let channel;

const switchChannel = (client, name) => {
    const guild = client.guilds.get(aoh);
    channel = guild.channels.find(channel => channel.name === name);
    console.log(channel.name);
    return channel;
};

const listener = client => text => {
    console.log('received data:', util.inspect(text));

    switch (true) {
        case text.startsWith('/channel'):
            const name = text.replace(/\/channel |\n/g, '');
            return switchChannel(client, name);
        default:
            return channel.send(text);
    }
};

const init = client => {
    switchChannel(client, 'general');

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', listener(client));
};

module.exports = {
    init
};
