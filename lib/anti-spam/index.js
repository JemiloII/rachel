const knexfile = require('../../knexfile.js');
const knex = require('knex')(knexfile);
const logger = require('../common/logger');

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
            return WriteUpsChannel.send(`Banned\nid: ${message.author.id}\nname: ${message.author.displayName}\nreason: Sending an nsfw spam link!`);
        }

        if (isDiscordLink && !isPartner) {
            await message.reply(`Sorry, discord links aren't allowed here.`);
            await WriteUpsChannel.send(`Warning\nid: ${message.author.id}\nname: ${message.author.displayName}\nreason: Sending a discord invite link!`);
            return message.delete();
        }
    });

    client.on('guildBanAdd', async (guild, user) => {
        const messageId = await knex('guild_members').where({id: user.id}).then(members => members && members[0].messageId);
        const welcomeMessage = await client.fetchMessage(messageId);
        await welcomeMessage.delete();
    });
};

module.exports = {
    init
};
