module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send(`${message.author} | Incorrect usage. Run \`${message.settings.prefix}help role\` for help.`);
    let flag = args[0].toLowerCase();
    let filter = m => m.author.id === message.author.id;
    let obj = { max: 1, time: 30000, errors: ['time'] };
    if (flag === '-add') { 
        if (message.settings.roles.length === 3) {
            return message.channel.send(`${message.author} | Sorry, but you have reached the maximum number of roles (\`3\`). Please remove a role if you wish to add this one.`);
        };
        let msg = await message.channel.send('Please provide a valid role mention, name, or ID to add.');
        message.channel.awaitMessages(filter, obj).then(msgs => {
            let role = msgs.first().mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.roles.get(msgs.first().content.split(' ')[0]);
            if (!role) return msg.edit('Couldn\'t find that role.');
            message.settings.roles.push(role.id);
            client.settings.set(message.guild.id, message.settings);
            msgs.first().delete();
            return msg.edit(`Successfully added the role \`${role.name}\` to your rainbow roles list.`);
        }).catch(err => {
            return msg.edit('Menu timed out after 30 seconds.');
        });
    } else if (flag === '-remove' || flag === '-delete') {
    
        let msg = await message.channel.send('Please provide a valid role mention, name, or ID to remove.');
        message.channel.awaitMessages(filter, obj).then(msgs => {
            let role = msgs.first().mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.roles.get(msgs.first().content.split(' ')[0]);
            if (!role) return msg.edit('Couldn\'t find that role.');
            if (!message.settings.roles.includes(role.id)) return msgs.first().delete(), msg.edit('That role is not apart of your rainbow-roles list.');
            let index = message.settings.roles.indexOf(role.id);
            message.settings.roles.splice(index, 1);
            client.settings.set(message.guild.id, message.settings);
            msgs.first().delete();
            return msg.edit(`Successfully removed the role \`${role.name}\` from your rainbow roles list.`);
        }).catch(err => {
            return msg.edit('Menu timed out after 30 seconds.');
        });
    } else if (flag === '-view') {
        let names = [];
        message.settings.roles.forEach(r => {
            names.push(message.guild.roles.get(r).name);
        });
        return message.channel.send(`\`\`\`1) ${names[0]}\n2) ${names[1]}\n3) ${names[2]}\`\`\``);
    } else {
        return message.channel.send(`${message.author} | Invalid action. Valid actions: \`add\`, \`remove\`, \`view\``);
    };
};

module.exports.conf = {
    permissions: { user: ['MANAGE_ROLES'], bot: ['SEND_MESSAGES'] },
    aliases: ['rainbowrole']
};

module.exports.help = {
    name: 'role',
    description: 'Add or remove roles from your rainbow-roles list, or view your rainbow-roles list.',
    usage: '{prefix}role -<action>',
    parameters: 'stringAction'
};