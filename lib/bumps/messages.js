const {BumpsList} = require('./models');
const capitalize = require('lodash.capitalize');
const logger = require('../common/logger');

const createEmbed = (website, username, password, memberId) => ({
    title: memberId ? `${capitalize(website)} has been bumped!` : `Server is ready to be bumped!`,
    color: memberId ? 10534309 : 186903,
    description: memberId ? 'Server has been bumped by <@${memberId}> with the following infomation:' :
        `Please bump [${website}](https://${website}/) and react with a ✅ when the task is complete!`,
    fields: [
        {
            name: 'Username',
            value: username,
            inline: true
        },
        {
            name: 'Password',
            value: password,
            inline: true
        }
    ]
});

const bumpReady = async ({id: bumpId, channel, password, username, website}) => {
    const {messageId} = await sendBump(channel, website, username, password);
    await BumpsList.query({where: {bump_id: bumpId}, whereNull: 'message_id'})
        .fetch()
        .then(model => model.save({bumpId, messageId}));
};

const load = async (client, channelId) => {
    const channel = await client.channels.get(channelId);
    try {
        loadScheduled(channel);
    } catch (error) {
        logger.error('Failed to load scheduled bumps.');
    }
    const readyList = await BumpsList.query({
        whereNull: 'member_id',
        whereNotNull: 'message_id'
    }).fetchAll().then(toJSON);
    logger.verbose('readyList:', readyList);
    const messageIds = readyList.map(i => i.messageId);
    return channel.fetchMessages(messageIds);
};

const loadScheduled = async (channel) => {
    const scheduleList = await BumpsList.query({whereNull: 'message_id'}).fetchAll({withRelated: 'bump'}).then(toJSON);
    logger.verbose('scheduleList:', scheduleList);
    return scheduleList.forEach(({bump, bumpAt}) => {
        logger.info(`Loaded scheduled bump for ${bump.website} at ${bumpAt}`);
        try {
            schedule({...bump, channel}, new Date(bumpAt) - Date.now());
        } catch (error) {
            logger.error(`Failed to load scheduled bump for ${bump.website}`);
        }
    });
};

const schedule = async (bump, timeout) => {
    if (!timeout) {
        timeout = bump.hours * 360000;
        const bumpAt = new Date(Math.max(Date.now() + timeout, 0)).toISOString();
        await BumpsList.forge({bumpId: bump.id, bumpAt}).save();
    }
    return setTimeout(bumpReady, Math.max(timeout, 0), bump);
};

const sendBump = async (channel, website, username, password) => {
    const embed = createEmbed(website, username, password);
    const message = await channel.send('<@&517555791377727493>, <@&411644255971573782>, & <@&492530157941293056>', {embed});
    message.react('✅');
    return {messageId: message.id};
};

const toJSON = m => m.toJSON();

const updateBump = async (channel, messageId, memberId) => {
    const query = BumpsList.query({where: {message_id: messageId}, whereNull: 'member_id'});
    const message = await channel.fetchMessage(messageId);
    const result = await query.fetch({withRelated: 'bump'}).then(toJSON);
    const {bump: {website, username, password}} = result;

    const embed = createEmbed(website, username, password, memberId);
    await message.edit({embed});
    await query.save({memberId, messageId});

    return {channel, ...result.bump};
};

module.exports = {
    load,
    schedule,
    sendBump,
    updateBump
};
