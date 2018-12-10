const bookshelf = require('../../bookshelf');

const Guilds = bookshelf.Model.extend({
    tableName: 'guilds',
    channels() {
        return this.hasMany(Channels);
    }
});

module.exports = {Guilds};
