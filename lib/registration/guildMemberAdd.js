const bluebird = require('bluebird');
const logger = require('../common/logger.js');
const {GuildMembers, GuildMemberAssociations} = require('./models');

const addDefaultRoles = member => {
    const roles = {
        missingRoles: '518248472978128897',
        acquaintances: '411647640510660609',
        events: '533142769992990730',
        twitch: '533143157328838677',
        updates: '533142937421348875',
        about: '517154372724195330',
        games: '517154224979836939',
        pings: '539497041231872020'
    };
    member.addRoles(Object.values(roles));
};

const addMemberToDatabase = (member, messageId) => {
    const {id, displayName, joinedAt, joinedTimestamp, guild: {id: guildId}, user: {delimiter, username}} = member;
    const associations = {guildId, guildMemberId: id, date: joinedAt, timestamp: joinedTimestamp};
    const guildMember = {id, delimiter, displayName, username, messageId};
    return bluebird.join(
        GuildMembers.forge(guildMember).save(null, {method: 'insert'}),
        GuildMemberAssociations.forge(associations).save(null, {method: 'insert'}),
        () => logger.debug(`Saved ${username} to the database~`)
    ).catch(error => logger.error(`Failed to save ${username} to the database~`, error));
};

const log = member => {
    const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'joins-leaves');
    RegistrationRoom.send(`${member.displayName} has joined.`);
};

const sendWelcomeEmbed = (member) => {
    const GeneralChannel = member.guild.channels.find(ch => ch.name === 'general');
    const embed = {
        "title": `Welcome ${member.displayName} to Angels of Heaven!`,
        "description": `<@&516746746764722177> ${member}! Make sure to set your <#510082804655063060> and introduce yourself in <#517562086310674435> channel! You can use <#511301471690555407> to assign game roles.`,
        "color": 5046016,
        "thumbnail": {
            "url": "https://i.gifer.com/3iCH.gif"
        },
        "image": {
            "url": "https://orig00.deviantart.net/31ee/f/2016/202/3/a/kirino_gif_494x694_by_artemsan15-daaup2t.gif"
        }
    };
    GeneralChannel.startTyping(1);
    return GeneralChannel.send({embed})
        .then(message => {
            GeneralChannel.stopTyping();
            return message.id;
        });
};

const guildMemberAdd  = async member => {
    log(member);
    addDefaultRoles(member);
    await sendWelcomeEmbed(member)
        .then(messageId => addMemberToDatabase(member, messageId));
};

module.exports = guildMemberAdd;
