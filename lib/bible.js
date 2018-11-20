const config = require('config');
const fs = require('fs');
const request = require('request-promise');
const {baseUrl, token} = config.get('bible');
let bot;

const download = (type, verse) =>
    request({
        url: `${baseUrl}/v3/passage/${type}/`,
        headers: {
            Authorization: `Token ${token}`
        },
        json: type === 'text',
        qs: {
            q: verse.replace(/ /g, '+'),
            'include-passage-references': true,
            'include-verse-numbers': /-/g.test(verse),
            'include-footnotes': false,
            'include-footnote-body': false,
            'include-headings': false
        }
    });

const getVerse = message =>
    message.content
        .replace('bible ', '')
        .replace('--audio ', '')
        .replace('--text ', '')
        .replace('--verse ', '');

const joinAndPlayFile = (channel, file) =>
    channel.join()
        .then(voice => {
            console.log(`Joined channel`);
            voice.playFile(file);
        })
        .catch(console.error);

const playAudio = message => {
    const verse = getVerse(message);
    const dest = `./audio/${verse.replace('+', ' ')}.mp3`;
    const r = download('audio', verse);

    r.on('response', res => {
        const cws = fs.createWriteStream(dest);
        res.pipe(cws);

        cws.on('finish', () => cws.close(() => {
            message.channel.send(`audio saved: ${verse.replace('+', ' ')}`);
            const channel = message.member.voiceChannel;
            joinAndPlayFile(channel, dest);
        }));

        cws.on('error', error => {
            console.log(`audio failed for verse: ${verse} error: ${error}`);
            message.channel.send(`audio saved failed: ${verse.replace('+', ' ')}`);
            fs.unlink(dest);
        });
    });
};

const sendVerse = message => {
    const verse = getVerse(message);
    download('text', verse)
        .then(({passages}) => {
            const text = passages[0]
                .replace(' (ESV)', '')
                .replace('\n\n ', ' (ESV)\n\n');
            message.channel.send(text);
        })
        .catch(error => console.log('Error getting verse.', error));
};

const setClient = client => bot = client;

module.exports = {
    playAudio,
    sendVerse,
    setClient
};
