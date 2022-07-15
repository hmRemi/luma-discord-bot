const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
    Permissions
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user!')
        .addUserOption(option => option.setName('target').setRequired(true).setDescription(`The user you'd like to timeout.`))
        .addStringOption(option => option.setName('duration').setRequired(true).setDescription(`Set a duration for the timeout.`))
        .addStringOption(option => option.setName('reason').setRequired(true).setDescription(`Add a reasoning for your timeout.`))
        .addBooleanOption(option => option.setName('silent').setDescription('Input true if message should be silent').setRequired(true)),
    permissions: [Permissions.FLAGS.MODERATE_MEMBERS],
    botpermissions: [Permissions.FLAGS.MODERATE_MEMBERS],
    async execute(interaction) {
        const silent = interaction.options.getBoolean('silent');
        const user = interaction.options.getUser('target');
        const duration = Number(interaction.options.getString('duration')) * 60 * 1000;
        let reason = interaction.options.getString('reason');
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) return await interaction.reply({
            content: 'The user mentioned is no longer within the server.',
            ephemeral: true
        });

        if (!duration) return await interaction.reply({
            content: 'The duration prevoded is a not a valid number.'
        });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.username} has timed out a user;`,
                iconURL: 'https://cdn.discordapp.com/attachments/981264899034476644/995352929127116890/image_1.png',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setColor(`#2f3136`)
            .addField(`User:`, `\`\`\`${member.tag}:${member}\`\`\``)
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
            await member.timeout(duration, reason);
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
        } catch (error) {
            console.log(error);
        }
    }
}