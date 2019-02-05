const bookshelf = require('../../bookshelf');

const Bumps = bookshelf.Model.extend({
    tableName: 'bumps',
    bumpsList() {
        return this.hasMany(BumpsList);
    }
});

const BumpsList = bookshelf.Model.extend({
    tableName: 'bumps_list',
    bumps() {
        return this.belongsTo(Bumps);
    }

});

module.exports = {
    Bumps,
    BumpsList
};
