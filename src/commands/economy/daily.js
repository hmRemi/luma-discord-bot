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
        .setName("daily")
        .setDescription("Claim your daily reward"),
    async execute(interaction) {
        const {
            guild,
        } = interaction;
        const Embed = new MessageEmbed()
            .setAuthor("Economy System", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
            .setColor(`#2f3136`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

        const profile = await Balance.find({
            UserID: interaction.user.id,
            GuildID: guild.id
        });
        if (!profile.length) {
            await interaction.reply({
                embeds: [
                    Embed.setDescription("You don't have a profile yet. Please use `/createbal` to create one.")
                ]
            });
        } else {
            if (!profile[0].lastDaily) {
                await Balance.updateOne({
                    UserID: interaction.user.id,
                    GuildID: guild.id
                }, {
                    $set: {
                        lastDaily: Date.now()
                    }
                });
                await Balance.updateOne({
                    UserID: interaction.user.id,
                    GuildID: guild.id
                }, {
                    $inc: {
                        Wallet: 1000
                    }
                });
                await interaction.reply({
                    embeds: [
                        Embed
                        .setTitle(`${interaction.user.username}'s Daily`)
                        .setDescription(`You have collected today's earnings ($1000).\nCome back tomorrow to collect more.`)
                    ]
                });
            } else if (Date.now() - profile[0].lastDaily > 86400000) {
                await Balance.updateOne({
                    UserID: interaction.user.id,
                    GuildID: guild.id
                }, {
                    $set: {
                        lastDaily: Date.now()
                    }
                });
                await Balance.updateOne({
                    UserID: interaction.user.id,
                    GuildID: guild.id
                }, {
                    $inc: {
                        Wallet: 1000
                    }
                });
                await interaction.reply({
                    embeds: [
                        Embed
                        .setTitle(`${interaction.user.username}'s Daily`)
                        .setDescription(`You have collected today's earnings ($1000).\nCome back tomorrow to collect more.`)
                    ]
                });
            } else {
                const lastDaily = new Date(profile[0].lastDaily);
                const timeLeft = Math.round((lastDaily.getTime() + 86400000 - Date.now()) / 1000);
                const hours = Math.floor(timeLeft / 3600);
                const minutes = Math.floor((timeLeft - hours * 3600) / 60);
                const seconds = timeLeft - hours * 3600 - minutes * 60;
                await interaction.reply({
                    embeds: [
                        Embed
                        .setTitle(`${interaction.user.username}'s Daily`)
                        .setDescription(
                            `You have to wait ${hours}h ${minutes}m ${seconds}s before you can collect your daily earnings.`
                        )
                    ]
                });
            }
        }
    }
}