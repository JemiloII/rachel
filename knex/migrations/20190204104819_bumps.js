exports.up = knex =>
    knex.schema
        .createTable('bumps', table => {
            table.integer('id').primary();
            table.string('website');
            table.integer('hours');
            table.string('username');
            table.string('password');
        })
        .createTable('bumps_list', table => {
            table.integer('id').primary();
            table.integer('bump_id');
            table.datetime('bump_at').defaults(knex.raw(`DATETIME('now', '+6 hours', 'localtime');`));
            table.integer('member_id');
        });

exports.down = knex =>
    knex.schema
        .dropTable('bumps')
        .dropTable('bumps_list');
