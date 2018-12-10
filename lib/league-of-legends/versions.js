const request = require('request-promise');

let versions = {};

const updateVersions = async () => {
    try {
        const {cdn, l, n} = await request.get('https://ddragon.leagueoflegends.com/realms/na.json', {json: true});
        versions = {i18n: l, cdn, ...n};
    } catch (error) {
        console.error('Failed to update the League of Legends versions! Error:', error);
    }
    setTimeout(updateVersions, 1000 * 60 * 60 * 24);
};

updateVersions();

module.exports = () => versions;
