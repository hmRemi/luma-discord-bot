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
        .setName('lock')
        .setDescription('Lock this channel.')
        .addStringOption(option => option.setName("time").setDescription("Expire date for this lockdown (1m, 1h, 1d)").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Provide a reason for this lockdown.")),

       permissions: [Permissions.FLAGS.MANAGE_ROLES],
    botpermissions: [Permissions.FLAGS.MANAGE_ROLES],
    async execute(interaction) {
        const { guild, channel, options } = interaction;

        const Reason = options.getString("reason") || "No specified reason";

        const Embed = new MessageEmbed()
            .setAuthor("Lockdown System", "https://cdn.discordapp.com/attachments/981264899034476644/995717763702214776/image_11.png")
            .setColor('#2f3136')
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        if(!channel.permissionsFor(guild.id).has("SEND_MESSAGES")) return interaction.reply({
            embeds: [Embed.setDescription("This channel is already locked.")]
        });

        channel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGES: false,
        });

        const Time = options.getString("time");

        interaction.channel.send({
            embeds: [Embed.setDescription(`This channel is now under lockdown for reason: ${Reason}`)]
        });

        if(Time) {
            const ExpireDate = Date.now() + ms(Time);
            DB.create({
                GuildID: guild.id,
                ChannelID: channel.id,
                Time: ExpireDate
            });

            setTimeout(async () => {
                channel.permissionOverwrites.edit(guild.id, {
                    SEND_MESSAGES: null,
                });
                interaction.editReply({
                    embeds: [
                        Embed.setDescription("The lockdown has been lifted.")
                    ]
                }).catch(() => {});
                await DB.deleteOne({
                    ChannelID: channel.id, });
            }, ms(Time));
        }
    }
}