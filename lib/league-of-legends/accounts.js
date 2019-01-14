const config = require('config');
const Discord = require('discord.js');
const {LeagueOfLegends} = require('./models');
const request = require('request-promise').defaults({headers: {"X-Riot-Token": config.get('leagueOfLegends').token}, json: true});
const userBot = new Discord.Client({disableEveryone: true});

userBot.on('ready', () => console.log(`Logged in as ${userBot.user.tag}!`));

userBot.login(config.get('discord').user.token)
    .catch(error => console.error('Failed to login user account. error:', error));

const save = (summonerInfo) => {
    console.log('User League Info', summonerInfo);
    return LeagueOfLegends.forge(summonerInfo).save(null, {method: 'insert'})
        .then(() => console.log('Successfully saved summoner info:', summonerInfo))
        .catch({code: 'SQLITE_CONSTRAINT'}, () => console.log('Already saved summonerInfo:', summonerInfo))
        .catch(error => console.error('Failed to save summoner info:', summonerInfo, 'error:', error));
};

const register = async (member, count = 0) => {
    const guildMemberId = member.id;
    console.log('Checking for User Account', guildMemberId);
    const user = userBot.users.get(guildMemberId);
    if (!user && count < 15) {
        return setTimeout(register, 500, member, ++count);
    } else if (!user && count >= 15) {
        console.log('Failed to receive user profile info.', guildMemberId);
        return;
    }

    console.log('Checking for League Account', guildMemberId);
    const profile = await user.fetchProfile();
    const info = profile.connections.find(v => v.type === 'leagueoflegends');

    if (info) {
        console.log('Found League Account', guildMemberId);
        const {name} = info;
        const [prefix, id] = info.id.split('_');
        const region = prefix.replace(/\d*/g, '');
        return save({id, guildMemberId, name, region});
    }
};

const manuallyRegister = async (member, region, summonerName) => {
    const uri = `https://${region}1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}`;
    return request.get({uri})
        .then(r => console.log(r) || r)
        .then(({id, name}) => save({id, name, region, guildMemberId: member.id}));
};

const link = (message, input) => {
    if (!input) {
        return register(message.member)
            .then(() => message.reply('Successfully linked your league account!'))
            .catch(() => message.reply('Failed to link your league account!'));
    }
    const [region, ...name] = input.split(' ');
    const summonerName = name.join(' ');
    return manuallyRegister(message.member, region, summonerName)
        .then(() => message.reply('Successfully linked your league account!'))
        .catch(() => message.reply('Failed to link your league account!'));
};

module.exports = {
    link,
    register
};
