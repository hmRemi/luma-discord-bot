const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    Permissions
} = require('discord.js');

const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick a user!')
        .addUserOption(option => option.setName('target').setDescription('Input user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Input reason for kick.').setRequired(true))
        .addBooleanOption(option => option.setName('silent').setDescription('Input true if message should be silent').setRequired(true)),

    permissions: [Permissions.FLAGS.KICK_MEMBERS],
    async execute(interaction) {
        const silent = interaction.options.getBoolean('silent');

        const kickUser = interaction.options.getUser('target');
        const kickMember = await interaction.guild.members.fetch(kickUser.id);

        if (!kickMember) return await interaction.reply({
            content: 'The user mentioned is no longer within the server.',
            ephemeral: true
        });

        let reason = interaction.options.getString('reason');

        const embedKicked = new MessageEmbed()
            .setAuthor({
                name: `Kick Notification`,
                iconURL: 'https://cdn.discordapp.com/attachments/981264899034476644/995352929127116890/image_1.png',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setColor(`#2f3136`)
            .setDescription(`You have been **kicked** from **${interaction.guild.name}**.`)
            .addField(`Reason:`, `\`\`\`${reason}\`\`\``)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

        await kickMember.send({
            embeds: [embedKicked]
        }).catch(err => console.log("The user who was kicked did not receive the message due to DM's being toggled."));

        await kickMember.kick({
            reason: reason
        }).catch(err => console.error(err));

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.username} has kicked a user;`,
                iconURL: 'https://cdn.discordapp.com/attachments/981264899034476644/995352929127116890/image_1.png',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setColor(`#2f3136`)
            .addField(`User:`, `\`\`\`${kickUser.tag}:${kickUser}\`\`\``)
            .addField(`Reason:`, `\`\`\`${reason}\`\`\``)
            .addFields({
                name: 'Membership',
                value: `Premium`,
                inline: true
            }, {
                name: 'Moderator',
                value: `${interaction.user}`,
                inline: true
            }, )
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')


        if (silent) {
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } else {
            interaction.channel.send({
                embeds: [embed],
                ephemeral: false
            });
        }

    }
}