const bookshelf = require('../../bookshelf');
const {Guilds} = require('../guilds/models');

Guilds.extends({
    channels() {
        this.hasMany(Channels);
    }
});

const Channels = bookshelf.Model.extend({
    tableName: 'channels',
    guild() {
        return this.belongsTo(Guilds);
    },
    messages() {
        return this.hasMany(Messages);
    }
});

const Messages = bookshelf.Model.extend({
    tableName: 'messages',
    channel() {
        return this.belongsTo(Channels);
    },
    roleGroup() {
        return this.belongsTo(RoleGroups);
    }
});

const RoleGroups = bookshelf.Model.extend({
    tableName: 'role_groups',
    messages() {
        return this.belongsToMany(Messages);
    },
    roles() {
        return this.hasMany(Roles);
    }
});

const Roles = bookshelf.Model.extend({
    tableName: 'roles',
    roleGroup() {
        return this.belongsTo(RoleGroups);
    }
});

module.exports = {
    Channels,
    RoleGroups,
    Messages,
    Roles
};
