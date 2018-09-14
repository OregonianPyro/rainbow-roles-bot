const { Client, Collection, RichEmbed } = require('discord.js');
const Enmap = require('enmap');
const { table } = require('table');
const chalk = require('chalk');
const fs = require('fs');
const guild_data = [['Guild Name', 'Members', 'Guild ID', '# of Roles']];
const commandLoadData = [['Command Name', 'Aliases', 'Status']];
const ms = require('ms');
const moment = require('moment');
require('dotenv').config();

class RainbowRoles extends Client {
    constructor(options) {
        super(options);
        this.settings = new Enmap({ name: 'settings' });
        this.commands = new Collection();
        this.aliases = new Collection();
        this.str = (msg, err) => { return msg.channel.send(`${msg.author} | ${str}`) };
    };
};

const client = new RainbowRoles();
const init = async () => {
    fs.readdir('./commands/', (err, files) => {
        if (err) console.error(err);
        files.forEach(file => {
            if (file.split('.')[1] !== 'js') return;
            const props = require(`./commands/${file}`);
            commandLoadData.push([props.help.name, props.conf.aliases.join(', '), 'Loaded Successfully']);
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(a => {
                client.aliases.set(a, props.help.name)
            });          
        });
    });
};

init();

client.on('ready', async () => {
    client.guilds.forEach(g => {
        if (client.settings.get(g.id).roles.length > 3) throw new Error(`Exeeded the maximum roles size for ${g.name}; maximum amount of roles is 3, and this server has more than 3 roles.`);
        guild_data.push([g.name, g.members.filter(u => !u.user.bot).size, g.id, client.settings.get(g.id).roles.length]);
        setInterval(async () => {
            client.settings.get(g.id).roles.forEach(async role => {
                try {
                    await g.roles.get(role).setColor(require('crypto').randomBytes(3).toString('hex'));
                    console.log(`Successfully changed the color of the role ${g.roles.get(role).name} to ${g.roles.get(role).hexColor}`);
                    if (client.channels.get('490017095967440906')) {
                        const embed = new RichEmbed()
                            .setAuthor(g.name, g.iconURL)
                            .setColor(g.roles.get(role).color)
                            .setDescription(`Changed the color for the role \`${g.roles.get(role).name}\` to \`${g.roles.get(role).hexColor}\``)
                            .setTimestamp();
                        client.channels.get('490017095967440906').send(embed);
                    };
                } catch (e) {
                    return console.error(e.stack);
                };
            });
        }, ms('1 hour'));
    });
    let time = moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
    console.log(`[ ${time} ] ${client.user.tag} connected to ${client.guilds.size} guilds!`);
    console.log(table(guild_data));
});

client.on('message', async (message) => {
    let client = message.client;
    if (message.channel.type !== 'text') return;
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, { prefix: 'rr!', roles: [] });
    message.settings = client.settings.get(message.guild.id);
    if (message.content.indexOf(message.settings.prefix) !== 0) return;
    const args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(message.settings.prefix.length).toLowerCase();
    command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!command) return;
    try {
        await command.run(client, message, args);
    } catch (err) {
        message.channel.send(`${message.author} | Whoops, that went wrong! Error: \`${e.message}\``);
        return console.error(e.stack);
    };
});

client.on('error', () => {});
client.login(process.env.TOKEN);