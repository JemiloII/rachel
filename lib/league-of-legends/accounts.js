const Discord = require('discord.js');
const {LeagueOfLegends} = require('./models');
const userBot = new Discord.Client({disableEveryone: true});

userBot.on('ready', () => console.log(`Logged in as ${userBot.user.tag}!`));

userBot.login('MjIzMjYwODYyNzM4MjAyNjI1.DuxO3A.HZJ4hjsyMtcbSguSuT3SuS1Q7Ss')
    .catch(error => console.error('Failed to login user account. error:', error));

const save = (summonerInfo) => {
    console.log('User League Info', summonerInfo);
    return LeagueOfLegends.forge(summonerInfo).save(null, {method: 'insert'})
        .then(() => console.log('Successfully saved summoner info:', summonerInfo))
        .catch({code: 'SQLITE_CONSTRAINT'}, () => console.log('Already saved summonerInfo:', summonerInfo))
        .catch(error => console.error('Failed to save summoner info:', summonerInfo, 'error:', error));
};

const registerAccount = async member => {
    const guildMemberId = member.id;
    const profile = await userBot.users.get(guildMemberId)
        .fetchProfile();
    const info = profile.connections.find(v => v.type === 'leagueoflegends');

    if (info) {
        const {name} = info;
        const [region, id] = info.id.split('_');
        return save({id, guildMemberId, name, region});
    }
};

module.exports = {
    registerAccount
};
