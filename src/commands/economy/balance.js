const {
    SlashCommandBuilder
} = require("@discordjs/builders");

const {
    CommandInteraction,
    Permissions,
    MessageEmbed
} = require("discord.js");

const Balance = require("../../database/models/balanceSchema");

const {
    default: mongoose
} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Return balance of user")
        .addUserOption((option) => option.setName("target").setDescription("The user mentioned.")),
    async execute(interaction) {
        const {
            options,
            guild,
        } = interaction;

        const user = options.getUser("target") || interaction.user;

        const Embed = new MessageEmbed()
            .setAuthor("Economy System", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
            .setColor(`#2f3136`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

        let balanceProfile = await Balance.find({
            UserID: user.id,
            GuildID: guild.id
        });

        if (balanceProfile.length) {
            await interaction.reply({
                embeds: [Embed
                    .setDescription(`Information found on ${user}'s balance.`)
                    .addField(`**Wallet**`, `\`\`\`$${balanceProfile[0].Wallet}\`\`\``)
                    .addField(`**Bank**`, `\`\`\`$${balanceProfile[0].Bank}\`\`\``)
                ]
            })
        } else {
            if (user !== interaction.user)
                return await interaction.reply({
                    embeds: [Embed.setDescription(`${user} has no balance.`)]
                });

            await interaction.reply({
                embeds: [
                    Embed.setDescription("You don't have a profile yet. Please use `/createbal` to create one.")
                ]
            });
        }
    }
}