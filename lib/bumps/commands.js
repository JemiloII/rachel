const {Bumps, BumpsList} = require('./models');
const {cleanup} = require('../common/helpMenu');
const logger = require('../common/logger');
const {sendBump, schedule} = require('./messages');

const add = async ({channel}, input) => {
    const [website, hours, username, password] = input.split(' ');
    switch (true) {
        case !/.*\..{2,3}/.test(website):
            return warn('Invalid website domain.');
        case isNaN(hours):
            return warn('Invalid countdown hours.');
        case username.length === 0:
            return warn('Missing username.');
        case password.length === 0:
            return warn('Password missing.');
    }

    const {id} = await Bumps.forge({website, hours, username, password}).save();
    await BumpsList.forge({bump_id: id}).save();
    channel.send(`Added server: ${website} successfully!`);
    return schedule({id, hours, website, username, password, channel});
};

const help = (message, countdown = 15) => {
    const text =
        `\n**Bump Commands**
        　\`help\`
        　　- Shows this menu
        
        　\`add [website] [hours] [username] [password]\`
        　　- Adds a new discord bump server
        　　　ex) add test.com 6 Mitsuha RipComet2013
        `.replace(/ {8}/g, ''); // increase by 8 if you change the tabs
    const updatedText = text.concat(`\nRemoving menu in ${countdown} seconds`);
    message.delete();
    return message.reply(updatedText)
        .then(sent => cleanup(message.author, sent, countdown, text));
};

const test = async ({channel}, input) => {
    const [website, username, password] = input.split(' ');
    return await sendBump(channel, website, username, password);
};

const warn = message => {
    logger.warn(message);
    return message.reply(message);
};

module.exports = {
    add,
    help,
    test
};
