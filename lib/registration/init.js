const init = (client, clientUser) => {
    client.on('guildMemberAdd', async member => {
        const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'joins-leaves');
        const Initiates = member.guild.roles.find(info => info.name === 'Initiate Friends');
        const InitiateFriends = member.guild.roles.find(info => info.name === 'Initiates');
        await member.addRoles([Initiates, InitiateFriends]);
        RegistrationRoom.send(`${member.displayName} has joined.`);
        sendEmbed(member);
    });

    client.on('guildMemberRemove', async member => {
        const RegistrationRoom = member.guild.channels.find(ch => ch.name === 'joins-leaves');
        RegistrationRoom.send(`${member.displayName} has left.`);
    });
};

module.exports = init;
