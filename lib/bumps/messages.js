const {BumpsList} = require('./models');
const logger = require('../common/logger');

const createEmbed = (website, username, password, memberId) => ({
    title: memberId ? `Server has been bumped by <&@${memberId}>` : 'Server is ready to be bumped!',
    color: memberId ? 10534309 : 186903,
    description: memberId ? 'Server bumped with the follow infomation:' : 'Please bump the server and react with a ✅ when the task is complete!',
    fields: [
        {
            name: 'Website',
            value: `[${website}](https://${website}/)`,
            inline: true
        },
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
    await BumpsList.forge({bumpId, messageId}).save();
};

const load = async (client, channelId) => {
    const channel = client.channels.get(channelId);
    loadScheduled(channel);
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

const schedule = (bump, timeout = bump.hours * 360000) => setTimeout(bumpReady, Math.max(timeout, 0), bump);

const sendBump = async (channel, website, username, password) => {
    const embed = createEmbed(website, username, password);
    const message = await channel.send('<&@517555791377727493>, <&@411644255971573782>, & <@&492530157941293056>', {embed});
    message.react('✅');
    return {messageId: message.id};
};

const toJSON = m => m.toJSON();

const updateBump = async (channel, messageId, memberId) => {
    const message = channel.fetchMessage(messageId);
    const bumpEntry = await BumpsList.forge({messageId}).fetch({withRelated: 'bump'});
    const {bump: {website, username, password}} = bumpEntry;

    await bumpEntry.save({memberId});
    const embed = createEmbed(website, username, password, memberId);
    await message.edit({embed});

    return {channel, ...bumpEntry.bump};
};

module.exports = {
    load,
    schedule,
    sendBump,
    updateBump
};
