const algorithm = 'aes-256-ctr';
const config = require('config');
const crypto = require('crypto');

const secret = config.get('secret');

const encrypt = text => {
    const cipher = crypto.createCipher(algorithm, secret);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

const decrypt = text => {
    const decipher = crypto.createDecipher(algorithm, secret);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

module.exports = {
    encrypt,
    decrypt
};
