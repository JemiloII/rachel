const request = require('request-promise');
const versions = require('./versions');

const info = async (message, input) => {
    const name = input.toLowerCase()
        .replace(/['.]/g, '')
        .split(/ /)
        .map(text => text.charAt(0).toUpperCase() + text.slice(1))
        .join('');

    const {cdn, champion, i18n} = versions();
    const res = await request(`${cdn}/${champion}/data/${i18n}/champion/${name}.json`, {json: true});
    const data = res.data[name];

    message.channel.send({
        embed: {
            title: `${data.name}, ${data.title}`,
            description: data.lore,
            color: 10092288,
            url: `https://na.leagueoflegends.com/en/game-info/champions/${name}/`,
            image: {
                url: `${cdn}/img/champion/splash/${name}_0.jpg`

            },
            thumbnail: {
                url: `${cdn}/${champion}/img/champion/${data.image.full}`
            }
        }
    });
};

module.exports = {
    info
};
