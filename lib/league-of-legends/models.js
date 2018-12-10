const bookshelf = require('../../bookshelf');

const LeagueOfLegends = bookshelf.Model.extend({
    tableName: 'league_of_legends'
});

module.exports = {
    LeagueOfLegends
};
