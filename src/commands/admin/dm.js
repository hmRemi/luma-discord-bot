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
        .setName('dm')
        .setDescription('DM a user!')
        .addUserOption(option => option.setName('target').setDescription('Input user').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Input message').setRequired(true)),

    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction) {

        const user = interaction.options.getUser('target');
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) return await interaction.reply({
            content: 'The user mentioned is no longer within the server.',
            ephemeral: true
        });

        let message = interaction.options.getString('message');

        const embedBanned = new MessageEmbed()
            .setAuthor({
                name: `Developer Notice`,
                iconURL: 'https://images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setColor(`#2f3136`)
            .setDescription(`${message}`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

            await member.send({
                embeds: [embedBanned]
            }).catch(err => console.log("The user who was banned did not receive the message due to DM's being toggled."));

        const embed = new MessageEmbed()
            .setAuthor({
                name: `Sent a message to ${member}!`,
                iconURL: 'https://images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setColor(`#2f3136`)
            .addField(`User:`, `\`\`\`${member.tag}:${member}\`\`\``)
            .addField(`Message:`, `\`\`\`${message}\`\`\``)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')


        interaction.channel.send({
            embeds: [embed],
            ephemeral: false
        });

    }
}