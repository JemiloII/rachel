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

const getSearchName = properties => {
    const search = [];
    while (!/'$/.test(properties[0])) {
        search.push(properties.shift());
    }
    search.push(properties.shift());
    return search.join(' ').replace(/'/g, '');
};

const getProperty = (object = {}, properties = []) => {
    if (properties.length > 0) {
        let newObject;
        if (object instanceof Map) {
            newObject = object.get(properties[0]);
            logger.verbose('properties[0]', properties[0]);
            logger.verbose('newObject', newObject);
            if (!newObject) {
                if (/^'.*'$/.test(properties[0])) {
                    const name = properties[0].replace(/'/g, '');
                    newObject = object.find(value => value.name === name);
                    properties.shift();
                } else if (/^'/.test(properties[0])) {
                    const name = getSearchName(properties);
                    newObject = object.find(value => value.name === name);
                }
            } else {
                properties.shift();
            }
        } else {
            newObject = object[properties[0]];
            properties.shift();
        }
        return getProperty(newObject, properties);
    }
    return object;
};

let lastText;
const listener = client => text => {
    logger.verbose('received data:', util.inspect(text));

    switch (true) {
        case text.startsWith('/channel'):
            lastText = text;
            const name = text.replace(/\/channel |\n/g, '');
            return switchChannel(client, name);
        case text.startsWith('/client'):
            lastText = text;
            const input = text.replace(/\/client |\n/g, '');
            const properties = input.split(/\s|\./);
            console.log(input, '\n', properties);
            return console.log(getProperty(client, properties));
        default:
            lastText = text;
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
