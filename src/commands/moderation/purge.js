const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    Permissions
} = require('discord.js');

const { MessageEmbed } = require('discord.js');

const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Mass delete messages in a channel.')
        .addIntegerOption(option => option.setName('amount').setDescription('Enter an amount of messages that is going to be deleted.').setRequired(true)),
    permissions: [Permissions.FLAGS.MANAGE_MESSAGES],

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if(amount > 100) 
            return interaction.followUp({
                content:
                    "The maximum amount of message you can delete is 100."
            });

        const messages = await interaction.channel.messages.fetch({
            limit: amount + 1,
        });

        const filtered = messages.filter(
            (msg) => Date.now() - msg.createdTimestamp < ms("14 days")
        );

        await interaction.channel.bulkDelete(filtered)

        const embed = new MessageEmbed()
            .setAuthor({ name: `${interaction.user.username} has purged ${filtered.size - 1} messages`, iconURL: 'https://cdn.discordapp.com/attachments/981264899034476644/995352929127116890/image_1.png', url: 'https://discord.gg/ma6TcSambz' })
            .setColor(`#2f3136`)
            .addFields(
                { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
                { name: 'Moderator', value: `${interaction.user}`, inline: true },
            )
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
    

        interaction.channel.send({
            embeds: [embed]
        });
    },
}