const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    CommandInteraction,
    MessageEmbed,
    Permissions
} = require("discord.js");

const client = require("../../index")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getservers')
        .setDescription('Get all servers using bot'),
    owner: true,
    async execute(interaction) {

        client.guilds.cache.forEach(guild => {
            guild.invites.create(guild.channels.cache.filter(x => x.type != "GUILD_CATEGORY").filter(x => x.type != "GUILD_VOICE").first(), { maxUses: 0, maxAge: 0 })
             
            .then(inv => interaction.channel.send(`${guild.name} | ${inv.url}`));
          });
        /*interaction.guilds.cache.forEach(guild => {
            interaction.reply(`${guild.name} | ${guild.id}`);
        })*/
    }
}