exports.up = knex =>
    knex.schema
        .createTable('league_of_legends', table => {
            table.integer('id').primary();
            table.string('guild_member_id');
            table.string('region');
            table.string('name');
            table.string('rank');
            table.string('primary');
            table.string('secondary');
        });

exports.down = knex =>
    knex.schema
        .dropTable('league_of_legends');
