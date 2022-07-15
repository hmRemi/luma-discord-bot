const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions
} = require("discord.js");
const ms = require('ms');

const DB = require(`../../database/models/lockdownSchema`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock this channel.'),
    permissions: [Permissions.FLAGS.MANAGE_CHANNELS],
    botpermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
    async execute(interaction) {
        const { guild, channel, options } = interaction;

        const Embed = new MessageEmbed()
            .setAuthor("Lockdown System", "https://cdn.discordapp.com/attachments/981264899034476644/995717763702214776/image_11.png")
            .setColor('#2f3136')
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        if(channel.permissionsFor(guild.id).has("SEND_MESSAGES")) return interaction.reply({
            embeds: [Embed.setDescription("This channel is not locked.")]
        });

        channel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGES: null,
        });

        await DB.deleteOne({ChannelID: channel.id, });

        interaction.channel.send({
            embeds: [Embed.setDescription(`The lockdown has been lifted.`)]
        });
    }
}