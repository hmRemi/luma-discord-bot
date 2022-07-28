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
        .setName('ban')
        .setDescription('Ban a user!')
        .addUserOption(option => option.setName('target').setDescription('Input user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Input reason for ban.').setRequired(true))
        .addBooleanOption(option => option.setName('appealable').setDescription('Input true if ban should be appealable').setRequired(true))
        .addBooleanOption(option => option.setName('hidereason').setDescription('Input true if reason should be hidden').setRequired(true))
        .addBooleanOption(option => option.setName('silent').setDescription('Input true if message should be silent').setRequired(true)),
    permissions: [Permissions.FLAGS.BAN_MEMBERS],
    botpermissions: [Permissions.FLAGS.BAN_MEMBERS],
    async execute(interaction) {

        const silent = interaction.options.getBoolean('silent');
        const appealable = interaction.options.getBoolean('appealable');
        const hidereason = interaction.options.getBoolean('hidereason');

        const banUser = interaction.options.getUser('target');
        const banMember = await interaction.guild.members.fetch(banUser.id);

        if (!banMember) return await interaction.reply({
            content: 'The user mentioned is no longer within the server.',
            ephemeral: true
        });

        let reason = interaction.options.getString('reason');

        if (!banMember.bannable) return interaction.reply("**Cannot Ban This User!**")

        const embedBanned = new MessageEmbed()
        .setAuthor({
            name: `Ban Notification`,
            iconURL: 'https://cdn.discordapp.com/attachments/981264899034476644/995352929127116890/image_1.png',
            url: 'https://discord.gg/ma6TcSambz'
        })
        .setColor(`#2f3136`)
        .setDescription(`You have been **banned** from **${interaction.guild.name}**.`)
        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        const embed = new MessageEmbed()
        .setAuthor({
            name: `${interaction.user.username} has banned a user;`,
            iconURL: 'https://cdn.discordapp.com/attachments/981264899034476644/995352929127116890/image_1.png',
            url: 'https://discord.gg/ma6TcSambz'
        })
        .setColor(`#2f3136`)
        .addField(`User:`, `\`\`\`${banUser.tag}:${banUser}\`\`\``)
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

        try {
            await banMember.ban({
                days: 7,
                reason: reason
            }).catch(err => {
                return interaction.reply(`Missing permissions: ${err}`)
            });

            if (hidereason) {
                await banMember.send({
                    embeds: [embedBanned
                        .addField(`Reason:`, `\`\`\`${reason}\`\`\``)
                        .addFields({
                            name: 'Appealable',
                            value: `${appealable}`,
                            inline: true
                        }, {
                            name: 'Length',
                            value: `Permanent`,
                            inline: true
                        }, )
                    ]
                }).catch(err => console.log("The user who was banned did not receive the message due to DM's being toggled."));
            } else {
                await banMember.send({
                    embeds: [embedBanned
                        .addField(`Reason:`, `\`\`\`**REDUCTED**\`\`\``)
                        .addFields({
                            name: 'Appealable',
                            value: `${appealable}`,
                            inline: true
                        }, {
                            name: 'Length',
                            value: `Permanent`,
                            inline: true
                        }, )
                    ]
                }).catch(err => console.log("The user who was banned did not receive the message due to DM's being toggled."));
            }

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
        } catch (err) {
            
        }
    }
}