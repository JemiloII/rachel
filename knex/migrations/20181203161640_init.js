exports.up = knex =>
    knex.schema
        .createTable('servers', table => {
            table.string('id').primary();
            table.string('name');
        })
        .createTable('channels', table => {
            table.string('id').primary();
            table.string('server_id');
            table.string('name');
            table.string('type');
        })
        .createTable('messages', table => {
            table.string('id').primary();
            table.string('channel_id');
            table.string('role_group_id');
            table.string('name');
        })
        .createTable('role_groups', table => {
            table.string('id').primary();
            table.string('name');
            table.string('description');
            table.boolean('select_multiple');
        })
        .createTable('roles', table => {
            table.integer('id').primary();
            table.string('role_group_id');
            table.string('name');
            table.string('emoji');
            table.string('text');
        });

exports.down = knex =>
    knex.schema
        .dropTable('servers')
        .dropTable('channels')
        .dropTable('role_groups')
        .dropTable('messages')
        .dropTable('roles');
