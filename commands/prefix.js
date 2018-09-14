module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send(`${message.author} | Incorrect usage. Run \`${message.settings.prefix}help prefix\` for help.`)
    if (args[0].length >= 10) return message.channel.send(`${message.author} | Woah there, that seems a little long! Try a shorter prefix.`);
    message.settings.prefix = args[0];
    client.settings.set(message.guild.id, message.settings);
    return message.channel.send(`${message.author} | You prefix has been set to \`${args[0]}\``);
};

module.exports.conf = {
    permissions: { user: ['MANAGE_GUILD'], bot: ['SEND_MESSAGES'] },
    aliases: []
};

module.exports.help = {
    name: 'prefix',
    description: 'Changes the bot\'s prefix for your server.',
    usage: '{prefix}prefix',
    parameters: 'stringPrefix'
};