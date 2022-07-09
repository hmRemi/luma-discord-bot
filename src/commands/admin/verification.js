const {
    Captcha
} = require("captcha-canvas");
const {
    MessageAttachment,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const Guild = require(`../../database/models/guildSchema`)

const {
    default: mongoose
} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify yourself')
        .addSubcommand(subcommand =>
            subcommand
            .setName("panel")
            .setDescription("Send the verification panel."))
        .addSubcommand(subcommand =>
            subcommand
            .setName("setrole")
            .setDescription("Set the mentioned role for verifying.")
            .addRoleOption(option => option.setName("role").setDescription("The role mentioned")))
        .addSubcommand(subcommand =>
            subcommand
            .setName("settings")
            .setDescription("List all verification settings")),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === "panel") {
            const Embed = new MessageEmbed()
                .setTitle("Verification")
                .setDescription("Click the button to verify!")
                .setColor(`#2f3136`);

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("verify-send")
                    .setLabel("Verify")
                    .setStyle("PRIMARY")
                );

            await interaction.channel.send({
                embeds: [Embed],
                components: [buttons]
            });
        } else if (interaction.options.getSubcommand() === "setrole") {
            const role = interaction.options.getRole("role");

            let guildProfile = await Guild.findOne({
                guildID: interaction.guild.id
            });

            if (!guildProfile) {
                guildProfile = await new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id
                });
                await guildProfile.save().catch(err => console.log(err));
            }

            await Guild.findOneAndUpdate({
                guildID: interaction.guild.id
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
        } else if (interaction.options.getSubcommand() === "settings") {
            let guildProfile = await Guild.findOne({
                guildID: interaction.guild.id
            });

            if (!guildProfile) {
                guildProfile = await new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id
                });
                await guildProfile.save().catch(err => console.log(err));
            }

            if (guildProfile.verificationRoleID) {
                await interaction.channel.send(`Role: ${guildProfile.verificationRoleID}`)
            } else {
                await interaction.channel.send(`Role hasn't been setup.`)

            }
        } else if (interaction.options.getSubcommand() === "setguildid") {
        }
    }
}