const {
    SlashCommandBuilder
} = require("@discordjs/builders");

const {
    CommandInteraction,
    Permissions,
    MessageEmbed
} = require("discord.js");

const Balance = require("../../database/models/balanceSchema");

const client = require("../../index");

const {
    default: mongoose
} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Get the leaderboard"),

    async execute(interaction) {
        const {
            options,
            guild,
        } = interaction;

        const Embed = new MessageEmbed()
        .setAuthor("Economy System", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
        .setColor(`#2f3136`)
        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        const profiles = await Balance.find({ GuildID: guild.id });

        if(!profiles) {
            return interaction.reply({
                embeds: [Embed.setDescription("No profiles found.")]
            });
        } else {
            const sortedProfiles = profiles.sort((a, b) => b.Wallet - a.Wallet);
            const top10 = sortedProfiles.slice(0, 10);

            top10.forEach((profile, index) => {
                Embed.addField(`${index + 1} ${client.users.cache.get(profile.UserID).username}`, `\`\`\`${profile.Wallet} €\`\`\``);
            });

            return interaction.reply({
                embeds: [Embed.setDescription(`Balance Leaderboard for ${guild.name}`)]
            });
        }
    }
}