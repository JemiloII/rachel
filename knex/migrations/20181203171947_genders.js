exports.up = function (knex, Promise) {
    return Promise.all([
        knex('role_groups').insert({name: 'genders', description: 'Select your gender!', select_multiple: false}).returning('role_group_id'),
        knex('servers').insert({id: '392422842454769664', name: 'Angels of Heaven'}),
        knex('channels').insert({id: '411645203154337792', name: 'roles', type: 'text', server_id: '392422842454769664'}),
    ])
        .spread(([role_group_id]) =>
            Promise.all([
                knex('messages').insert({id: '512731782421020735', name: 'genders', channel_id: '411645203154337792', role_group_id}),
                knex('roles')
                    .insert([
                        {name: 'male', emoji: 'male', role_group_id},
                        {name: 'female', emoji: 'female', role_group_id}
                    ])
                ]));
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex('servers').del(),
        knex('channels').del(),
        knex('messages').del(),
        knex('role_groups').del(),
        knex('roles').del()
    ]);
};
