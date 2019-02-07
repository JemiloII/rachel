const {Bumps, BumpsList} = require('./models');
const logger = require('../common/logger');
const {bumpReady} = require('./messages');

const reply = message => {
    logger.warn(message);
    return message.reply(message);
};

const add = async ({channel}, input) => {
    const [website, hours, username, password] = input.split(' ');
    if (!/.*\..{2,3}/.test(website)) {
        return reply('Invalid website domain.');
    } else if (isNaN(hours)) {
        return reply('Invalid countdown hours.');
    } else if (username.length === 0) {
        return reply('Missing username.');
    } else if (password.length === 0) {
        return reply('Password missing.');
    } else {
        const {id: bump_id} = await Bumps.forge({website, hours, username, password}).save();
        await BumpsList.forge({bump_id}).save();
        channel.send(`Added server: ${website} successfully!`);
        setTimeout(bumpReady, 3600000 * hours, {bump_id, website, username, password, channel});
    }
};

const test = async ({channel}, input) => {
    const [website, hours, username, password] = input.split(' ');
    if (!/.*\..{2,3}/.test(website)) {
        return reply('Invalid website domain.');
    } else if (isNaN(hours)) {
        return reply('Invalid countdown hours.');
    } else if (username.length === 0) {
        return reply('Missing username.');
    } else if (password.length === 0) {
        return reply('Password missing.');
    } else {
        await sendBump(channel, website, username, password);
    }
};

module.exports = {
    add,
    test
};
