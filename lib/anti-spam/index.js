const config = require('config');
const knexfile = require('../../knexfile.js');
const knex = require('knex')(knexfile);
const logger = require('../common/logger');
const request = require('request-promise');

const {apikey} = config.get('uploadfilter');

const ban = async member => {
    const WriteUpsChannel = member.guild.channels.find(ch => ch.name === 'writeups');
    await member.ban({reason: 'Probably a spam bot.', days: 7});
    logger.info(`Banned ${member.displayName} for probably being a spam bot`);
    return WriteUpsChannel.send(`Banned\nid: ${member.id}\nname: ${member.displayName}\nreason: Probably a spam bot.`);
};

const isAvatarNaked = async (url, level = 0) => {
    const {result: {classification_code = 0}} = await request({
        url: 'https://api.uploadfilter.io/v1/nudity',
        headers: {apikey, url}
    });

    return level < classification_code;
};

const isOverADayOld = date => {
    const day = 1000 * 60 * 60 * 24;
    const dayAgo= Date.now() - day;

    return date > dayAgo;
};

const init = (client) => {
    logger.info('Loaded Anti-Spam Module');

    client.on('message', async message => {
        const isAcquaintance = message.member.roles.find(role => role.name === 'Acquaintances');
        const isPartner = message.member.roles.find(role => role.name === 'Partner');
        const WriteUpsChannel = message.member.guild.channels.find(ch => ch.name === 'writeups');

        const urlRegExp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        const hasUrl = urlRegExp.test(message.content);
        const isBotSpam = /.*(naked|nude|pics|photos|.vip).*/gi.test(message.content);
        const isDiscordLink = /discord.gg/gi.test(message.content);

        if (isAcquaintance && hasUrl && isBotSpam) {
            await message.member.ban({reason: 'Sending an nsfw spam link!', days: 7});
            return WriteUpsChannel.send(`Banned\nid: ${message.member.id}\nname: ${message.member.displayName}\nreason: Sending an nsfw spam link!`);
        }

        if (isDiscordLink && !isPartner) {
            await message.reply(`Sorry, discord links aren't allowed here.`);
            await WriteUpsChannel.send(`Warning\nid: ${message.member.id}\nname: ${message.member.displayName}\nreason: Sending a discord invite link!`);
            return message.delete();
        }
    });

    client.on('guildMemberAdd', async member => {
        const url = member.user.displayAvatarUrl;
        if (/^[A-Z]\w*(\.\w*){1,2}$/.test(member.displayName)) {
            return await ban(member);
        }

        if (/[A-Z]\w*\d*/.test(member.displayName)) {
            if (isOverADayOld(member.user.createdAt)) {
                return await ban(member);
            }

            if (!url) {
                return await ban(member);
            }

            if (await isAvatarNaked(url)) {
                return await ban(member);
            }
        }

        // todo: fix as this might be banning people
        // if (await isAvatarNaked(url)) {
        //     return await ban(member);
        // }
    });

    client.on('guildBanAdd', async (guild, user) => {
        logger.debug('Running through the ban steps.');
        const messageId = await knex('guild_members')
            .where({id: user.id})
            .then(members => {
                logger.debug(`Cleaning up message for ${user.username} with id: ${user.id}`);
                return members && members[0] && members[0].message_id
            });

        if (messageId) {
            const GeneralChannel = guild.channels.find(channel => channel.name === 'general');
            const welcomeMessage = await GeneralChannel.fetchMessage(messageId);
            return await welcomeMessage.delete();
        }
    });
};

module.exports = {
    init
};
