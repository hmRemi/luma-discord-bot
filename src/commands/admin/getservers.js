const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getservers')
        .setDescription('Get all servers using bot'),
    async execute(interaction) {
        /*interaction.guilds.cache.forEach(guild => {
            interaction.reply(`${guild.name} | ${guild.id}`);
        })*/
    }
}