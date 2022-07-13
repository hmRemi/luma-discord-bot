const {
    Captcha
} = require("captcha-canvas");
const {
    MessageAttachment,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions
} = require("discord.js");
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const Verify = require(`../../database/models/verifySchema`)

const {
    default: mongoose
} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify yourself')
        .addSubcommand(subcommand =>
            subcommand
            .setName("setrole")
            .setDescription("Send the verification panel.")
            .addRoleOption(option => option.setName("role").setDescription('Set what role you should receive on verify.').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
            .setName("panel")
            .setDescription("Send the verification panel."))
        .addSubcommand(subcommand =>
            subcommand
            .setName("settings")
            .setDescription("List all verification settings")),
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "panel") {
            const Embed = new MessageEmbed()
                .setAuthor('Verification', 'https://media.discordapp.net/attachments/895632161057669180/964145767340204042/purchase_premium.png')
                .setDescription(`To proceed further in this discord server, please verify yourself to ensure that you're a human`)
                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                .setColor(`#2f3136`);

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("verify-send")
                    .setLabel("Verify")
                    .setStyle("PRIMARY")
                );

            let guildProfile = await Verify.findOne({
                GuildID: interaction.guild.id
            });

            if (!guildProfile.verificationRoleID) {
                return await interaction.reply(`Role hasn't been setup.`);
            }

            await interaction.channel.send({
                embeds: [Embed],
                components: [buttons]
            });
        } else if (interaction.options.getSubcommand() === "settings") {
            let guildProfile = await Verify.findOne({
                GuildID: interaction.guild.id
            });

            if (!guildProfile.verificationRoleID) {
                return await interaction.channel.send(`Role hasn't been setup.`)
            } else {
                return await interaction.channel.send(`Role: ${guildProfile.verificationRoleID}`)
            }
        } else if (interaction.options.getSubcommand() === "setrole") {
            const role = interaction.options.getRole("role");

            await Verify.findOneAndUpdate({
                GuildID: interaction.guild.id
            }, {
                verificationRoleID: role,
                lastEdited: Date.now()
            });

            const Embed = new MessageEmbed()
                .setTitle("Success!")
                .setDescription(`Role has been set to ${role}!`)
                .setColor(`#2f3136`);

            await interaction.reply({
                embeds: [Embed]
            });
        }
    }
}