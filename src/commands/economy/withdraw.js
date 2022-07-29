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
        .setName("withdraw")
        .setDescription("Withdraw money from your bank")
        .addIntegerOption((option) =>
            option
            .setName('amount')
            .setDescription('Specify the amount of money you want to withdraw')
            .setRequired(true)
        ),
    async execute(interaction) {
        const {
            guild,
            options,
        } = interaction;

        const profile = await Balance.find({
            UserID: interaction.user.id,
            GuildID: guild.id
        });

        const Embed = new MessageEmbed()
            .setAuthor("Economy System", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
            .setColor(`#2f3136`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

        if (!profile.length) {
            await interaction.reply({
                embeds: [
                    Embed.setDescription("You don't have a profile yet. Please use `/createbal` to create one.")
                ]
            });
        } else {
            const amount = options.getInteger('amount');
            if(amount > profile[0].Bank) {
                await interaction.reply({
                    embeds: [
                        Embed.setDescription("You don't have enough money in your bank.")
                    ]
                });
            } else {
                await Balance.updateOne(
                    { UserID: interaction.user.id, GuildID: guild.id },
                    { $inc: { Wallet: amount, Bank: -amount } }
                  );
                await interaction.reply({
                    embeds: [
                        Embed.setDescription("You have withdrawn $" + amount + " from your bank.")
                    ]
                });
            }
        }
    }
}