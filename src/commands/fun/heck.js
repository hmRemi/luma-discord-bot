const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const ms = require("ms")

const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("heck")
        .setDescription("heck someone")
        .addUserOption((option) =>
            option
            .setName("target")
            .setDescription("The user to heck")
            .setRequired(true)
        ),

    async execute(interaction) {
        const victim = interaction.options.getMember("target");

        const Embed = new MessageEmbed()
        .setAuthor("Hecker", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
        .setColor(`#2f3136`)
        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
        .setTimestamp();

        await interaction.reply({embeds: [Embed.setDescription(`Hacking ${victim.displayName}....`)]})
            .catch((err) => {})


        const time = "1s";
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription(`Finding ${victim.displayName}'s Email and Password.....`)]})
                .catch((err) => {})
        }, ms(time))

        const time1 = "6s"
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription(
                    `E-Mail: ${victim.displayName}@gmail.com \nPassword: ********`)]})
                .catch((err) => {})
        }, ms(time1))

        const time2 = "9s"
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription("Finding Other Accounts.....")]})
                .catch((err) => {})
        }, ms(time2))

        const time3 = "15s"
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription("Setting up Epic Games Account.....")]})
                .catch((err) => {})
        }, ms(time3))

        const time4 = "21s"
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription("Hacking Epic Games Account......")]})
                .catch((err) => {})
        }, ms(time4))

        const time5 = "28s"
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription("Hacked Epic Games Account!!")]})
                .catch((err) => {})
        }, ms(time5))

        const time6 = "31s"
        setTimeout(async function () {
            await interaction.editReply({embeds: [Embed.setDescription("Collecting Info.....")]}).catch((err) => {})
        }, ms(time6))

        const time7 = "38s"
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription("Selling data to FBI....")]})
                .catch((err) => {})
        }, ms(time7))

        const time8 = "41s"
        setTimeout(async function () {
            await interaction
                .editReply({embeds: [Embed.setDescription(`Finished hacking ${victim.displayName}`)]})
                .catch((err) => {})
        }, ms(time8))

        const time9 = "42s"
        setTimeout(async function () {
            await victim
                .send({embeds: [Embed.setDescription(`You've been hacked by ${interaction.user.username}`)]})
                .catch((err) => {})
        }, ms(time9))
    }
}