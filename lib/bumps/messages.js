const {Bumps, BumpList} = require('./models');

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

const bumpReady = async ({bump_id, channel, password, username, website}) => {
    const {message_id} = await sendBump(channel, website, username, password);
    await BumpsList.forge().where({bump_id}).save({message_id});
};

const load = async (client, channelId) => {
    const channel = client.channels.get(channelId);
    const list = await BumpList.forge().where({member_id: null}).whereNotNull('message_id');
    const messageIds = list.map(i => i.message_id);
    return channel.fetchMessages(messageIds);
};

const sendBump = async (channel, website, username, password) => {
    const message = await channel.send('<&517555791377727493>, <&411644255971573782>, & <&492530157941293056>', {
        embed: createEmbed(website, username, password)
    });

    message.react('✅');

    return {message_id: message.id};
};

const updateBump = async (channel, message_id, member_id) => {
    const message = channel.fetchMessage(message_id);

    const bumpEntry = await BumpList.forge().where({message_id});
    const {bump_id} = bumpEntry;
    const {website, hours, username, password} = await Bumps.forge().where({bump_id});
    await bumpEntry.save({member_id});

    await message.edit({
        embed: createEmbed(website, username, password, member_id)
    });

    return {bump_id, channel, hours, password, username, website};
};

module.exports = {
    bumpReady,
    load,
    sendBump,
    updateBump
};
