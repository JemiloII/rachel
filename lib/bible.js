const config = require('config');
const request = require('request-promise');
const {baseUrl, token} = config.get('bible');
let bot;

const sendVerse = message => {
    const verse = message.content.replace('--verse ', '').replace(/ /g, '+');
    request({
            url: `${baseUrl}/v3/passage/text/`,
            headers: {
                Authorization: `Token ${token}`
            },
            json: true,
            qs: {
                q: verse,
                'include-passage-references': true,
                'include-verse-numbers': /-/g.test(verse),
                'include-footnotes': false,
                'include-footnote-body': false,
                'include-headings': false
            }
        })
        .then(({passages}) => {
            const text = passages[0]
                .replace(' (ESV)', '')
                .replace('\n\n ', ' (ESV)\n\n');
            message.channel.send(text);
        })
        .catch(error => {
            console.log('Error getting verse.', error)
        });
};

const setClient = client => bot = client;

module.exports = {
    sendVerse,
    setClient
};