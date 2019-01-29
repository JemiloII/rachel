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

const gifs = [
    'http://hanatemplate.com/images/anime-gif-hi.gif',
    'https://orig00.deviantart.net/31ee/f/2016/202/3/a/kirino_gif_494x694_by_artemsan15-daaup2t.gif',
    'https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAqrsdHKxRymR9nos55QY5a4',
    'https://steamuserimages-a.akamaihd.net/ugc/543016399746318925/96FB222C2A270B1F98F15F37F6FF808BE4E268C5/',
    'https://i.gifer.com/4vss.gif',
    'https://k60.kn3.net/taringa/8/3/A/2/3/0/Obed1990/61C.gif',
    'https://gifimage.net/wp-content/uploads/2017/09/anime-transparent-gif-10.gif',
    'https://i.pinimg.com/originals/8b/dc/23/8bdc23303b9be85ccd2f5919d82bad20.gif'
];

const sendWelcomeEmbed = (member) => {
    const GeneralChannel = member.guild.channels.find(ch => ch.name === 'general');
    const imageUrl = gifs[Math.floor(Math.random() * 8)];
    const embed = {
        title: `Welcome ${member.displayName} to Angels of Heaven!`,
        description: `<@&516746746764722177> ${member}! Make sure to set your <#510082804655063060> and introduce yourself in <#517562086310674435> channel! You can use <#511301471690555407> to assign game roles.`,
        color: 5046016,
        thumbnail: {
            url: member.user.avatarURL
        },
        image: {
            url: imageUrl
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
