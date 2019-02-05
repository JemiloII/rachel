const sendBump = async (channel, website, username, password) => {
    const message = await channel.send({
        content: '<@&452264251134967808>',
        embed: {
            title: 'Server is ready to be bumped!',
            color: 186903,
            description: 'Please bump with the following\n infomation below. Please react\n ✅ When the task is complete!',
            fields: [
                {
                    name: 'Website',
                    value: `[${website}](https://${website}/)`
                },
                {
                    name: 'Username',
                    value: username
                },
                {
                    name: 'Password',
                    value: password
                }
            ]
        }
    });

    message.react('✅');
    return message;
};

module.exports = {
    sendBump
};
