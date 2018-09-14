module.exports.run = async (client, message, args) => {
    const msg = await message.channel.send('Pinging...');
    return msg.edit(`${message.author} Pong! API: \`${client.ping.toFixed()}ms\` | Latency: \`${msg.createdTimestamp - message.createdTimestamp}ms\``)
};

module.exports.conf = {
    permissions: { user: ['SEND_MESSAGES'], bot: ['SEND_MESSAGES'] },
    aliases: ['pong', 'ding', 'dong']
};

module.exports.help = {
    name: 'ping',
    description: 'Checks the connection speed between the bot and the Discord API.',
    usage: '{prefix}ping',
    parameters: 'None'
};