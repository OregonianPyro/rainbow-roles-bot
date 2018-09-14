module.exports = async (message) => {
    let client = message.client;
    if (message.channel.type !== 'text') return;
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, { prefix: 'rr!', roles: [] });
    message.settings = client.settings.get(message.guild.id);
    if (message.content.indexOf(message.settings.prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = message.content.split(' ')[0].slice(message.settings.prefix.length).toLowerCase();
    command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!command) return;
    try {
        await command.run(client, message, args);
    } catch (err) {
        message.channel.send(`${message.author} | Whoops, that went wrong! Error: \`${e.message}\``);
        return console.error(e.stack);
    };
};