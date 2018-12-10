const bookshelf = require('../../bookshelf');

const Guilds = bookshelf.Model.extend({
    tableName: 'guild',
});

const GuildMembers = bookshelf.Model.extend({
    tableName: 'guild_members',
});

const GuildMemberAssociations = bookshelf.Model.extend({
    tableName: 'guild_member_associations',
    guilds() {
        return this.hasMany(Guilds);
    },
    guildMembers() {
        return this.hasMany(GuildMembers);
    }
});

module.exports = {
    Guilds,
    GuildMembers,
    GuildMemberAssociations
};
