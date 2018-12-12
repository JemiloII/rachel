exports.up = knex =>
    knex.schema
        .createTable('guild_members', table => {
            table.string('id').primary();
            table.string('display_name');
            table.string('username');
            table.integer('delimiter');
            table.string('message_id');
        })
        .createTable('guild_member_associations', table => {
            table.string('guild_id');
            table.string('guild_member_id');
            table.date('date');
            table.integer('timestamp');
        })
        .createTable('writeups', table => {
            table.integer('id').primary();
            table.string('guild_member_id');
            table.string('reporter_id');
            table.string('description');
        })
        .createTable('bans', table => {
            table.integer('id').primary();
            table.string('guild_member_id');
            table.string('reason');
            table.string('duration');
            table.date('date');
        });

exports.down = knex =>
    knex.schema
        .dropTable('guild_members')
        .dropTable('guild_member_associations')
        .dropTable('writeups')
        .dropTable('bans');
