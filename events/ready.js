const crpyto = require('crypto');
const { table } = require('table');
const chalk = require('chalk');
const ms = require('ms');
const moment = require('moment');
const guild_data = [['Guild Name', 'Members', 'Guild ID', '# of Roles']];

module.exports.run = (client) => {
    client.guilds.forEach(g => {
        if (client.settings.get(g.id).roles.length > 3) throw new Error(`Exeeded the maximum roles size for ${g.name}; maximum amount of roles is 3, and this server has more than 3 roles.`);
        guild_data.push([g.name, g.members.filter(u => !u.user.bot).size, g.id, client.settings.get(g.id).roles.length]);
        setInterval(async () => {
            for (let role in client.settings.get(g.id).roles) {
                try {
                    await g.roles.get(role).setColor(crypto.randomBytes(3).toString('hex'));
                    console.log(`Successfully changed the color of the role ${g.roles.get(role).name} to ${g.roles.get(role).color}`);
                } catch (e) {
                    return console.error(e.stack);
                };
            };
        }, ms(client.settings.get(g.id).time));
    });
    let time = moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
    console.log(`[ ${time} ] ${client.user.tag} connected to ${client.guilds.size} guilds!`);
    console.log(table(guild_data));

};