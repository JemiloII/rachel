const {Bumps, BumpsList} = require('./models');
const {knex} = require('../../bookshelf');
const logger = require('../common/logger');
const messages = require('./messages');

const reply = message => {
    logger.warn(message);
    return message.reply(message);
};

const add = async (message, input) => {
    const [website, hours, username, password] = input.split(' ');
    if (!/.*\..{2,3}/.test(website)) {
        return reply('Invalid website domain.');
    } else if (isNaN(hours)) {
        return reply('Invalid countdown hours.');
    } else if (username.length === 0) {
        return reply('Missing username.');
    } else if (password.length === 0) {
        return reply('Password missing.')
    } else {
        const {bumpId} = await Bumps.forge({website, hours, username, password}).save();
        await messages.sendBump(message.channel, website, username, password);
        await BumpsList.forge({bumpId, bumpAt: knex.now()});
    }
};

const test = async (message, input) => {
    const [website, hours, username, password] = input.split(' ');
    if (!/.*\..{2,3}/.test(website)) {
        return reply('Invalid website domain.');
    } else if (isNaN(hours)) {
        return reply('Invalid countdown hours.');
    } else if (username.length === 0) {
        return reply('Missing username.');
    } else if (password.length === 0) {
        return reply('Password missing.')
    } else {
        await messages.sendBump(message.channel, website, username, password);
    }
};

module.exports = {
    add,
    test
};
