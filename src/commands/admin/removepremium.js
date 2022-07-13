const Premium = require(`../../database/models/premiumSchema`)

const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js')

const {
    default: mongoose
} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-premium')
        .setDescription('Remove a servers premium.'),

    async execute(interaction) {
        const Embed = new MessageEmbed()
        .setAuthor("Premium Manager", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
        .setColor(`#2f3136`)
        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        let premiumProfile = await Premium.findOne({
            GuildID: interaction.guild.id,
            GuildName: interaction.guild.name,
        });

        if(premiumProfile) {
            premiumProfile.delete();
            return await interaction.reply({
                embeds: [Embed.setDescription(`Premium features have been removed from ${interaction.guild.name}.`)]
            });
        } else {
            return await interaction.reply({
                embeds: [Embed.setDescription(`${interaction.guild.name} did not previously have premium features.`)]
            });
        }
    }
}