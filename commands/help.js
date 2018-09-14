module.exports.run = async (client, message, args) => {
    if (!args[0]) {
        let commands = [];
        for (let cmd in client.commands) {
            commands.push(`${message.settings.prefix}${cmd.help.name} | ${cmd.help.description}`);
        };
        return message.channel.send(`\`\`\`${commands.join('\n')}\`\`\``);
    } else {
        let cmd = args[0].toLowerCase();
        cmd = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!cmd) return;
        const obj = {
            name: cmd.help.name,
            desc: cmd.help.description,
            usage: cmd.help.usage.replace('{prefix}', message.settings.prefix),
            params: cmd.help.parameters,
            aliases: cmd.conf.aliases.length > 0 ? cmd.conf.aliases.join(', ') : 'No Aliases'
        };
        return message.channel.send(`Command: \`${obj.name}\`\n\`\`\`Description: ${obj.desc}\nUsage: ${obj.usage}\nParameters: ${obj.params}\nAliases: ${obj.aliases}\`\`\``);
    };
};

module.exports.conf = {
    permissions: { user: ['SEND_MESSAGES'], bot: ['SEND_MESSAGES'] },
    aliases: ['h']
};

module.exports.help = {
    name: 'help',
    description: 'Get help on the bot\'s commands, or on a specific command.',
    usage: '{prefix}help <command>',
    parameters: 'stringCommand'
};