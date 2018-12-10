const bluebird = require('bluebird');
const {registerAccount} = require('../league-of-legends/accounts');
const {GuildMembers, GuildMemberAssociations} = require('./models');

const addDefaultRoles = member => {
    const Initiates = member.guild.roles.find(info => info.name === 'Initiate Friends');
    const InitiateFriends = member.guild.roles.find(info => info.name === 'Initiates');
    member.addRoles([Initiates, InitiateFriends]);
};

const addMemberToDatabase = member => {
    const {id, displayName, joinedAt, joinedTimestamp, guild: {id: guildId}, user: {delimiter, username}} = member;
    const associations = {guildId, guildMemberId: id, date: joinedAt, timestamp: joinedTimestamp};
    const guildMember = {id, delimiter, displayName, username};
    return bluebird.join(
        GuildMembers.save(guildMember),
        GuildMemberAssociations.save(associations),
        () => console.log(`Saved ${username} to the database~`)
    ).catch(error => console.error(`Failed to save ${username} to the database~`, error));
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
    GeneralChannel.send({embed});
};

const guildMemberAdd  = async member => {
    log(member);
    addMemberToDatabase(member);
    addDefaultRoles(member);
    // registerAccount(member);
    sendWelcomeEmbed(member);
};

module.exports = guildMemberAdd;
