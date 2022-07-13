const Blacklist = require(`../../database/models/blacklistSchema`)

const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js')

const {
    default: mongoose
} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Mange blacklists')
        .addSubcommand(subcommand =>
            subcommand
            .setName("remove")
            .setDescription("Remove a blacklist")
            .addStringOption((option) =>
                option
                .setName('removeguild')
                .setDescription('Input guildid')
                .setRequired(true),
            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName("add")
            .setDescription("Add a blacklist")
            .addStringOption((option) =>
                option
                .setName('addguild')
                .setDescription('Input guildid')
                .setRequired(true),
            )),
    owner: true,
    async execute(interaction) {
        const Embed = new MessageEmbed()
        .setAuthor("Blacklist Manager", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
        .setColor(`#2f3136`)
        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        const removeguild = interaction.options.getString("removeguild");
        const addguild = interaction.options.getString("addguild");      
        
        let owner = await interaction.guild.fetchOwner();
        
        if (interaction.options.getSubcommand() === "add") {
            let addblacklistProfile = await Blacklist.findOne({
                GuildID: addguild,
            });

            if(addblacklistProfile) {
                return await interaction.reply({
                    embeds: [Embed.setDescription(`${addguild} is already blacklisted.`)]
                });
            } else {
                addblacklistProfile = await new Blacklist({
                    _id: mongoose.Types.ObjectId(),
                    GuildID: addguild,
                });
                await addblacklistProfile.save().catch(err => console.log(err));
                await interaction.reply({
                    embeds: [Embed.setDescription(`${addguild} has been blacklisted from Luma.`)]
                });

                return await owner.send({
                    embeds: [Embed.setDescription(`Your server has recently violated our terms of service, therefore we have decided to blacklist usage from your server indefinetely. Please note that this punishment is unappealable unless it is agreed on by both of the developers.\n
                    Effective immediately, you have lost permission to preform any command in any server under Luma. If you feel that this punishment was a case of abuse or unjustified, please contact @! [D] Lia.\n
                    Please acknowledge that this message is automated and that you will recieve no reply if you respond to this message.`)]
                }).catch(err => console.log("The user who was banned did not receive the message due to DM's being toggled."));
            }
        }

        if (interaction.options.getSubcommand() === "remove") {
            let removeblacklistProfile = await Blacklist.findOne({
                GuildID: removeguild,
            });

            if(removeblacklistProfile) {
                removeblacklistProfile.delete();
                await interaction.reply({
                    embeds: [Embed.setDescription(`${removeguild} has been unblacklisted from Luma.`)]
                });
                return await owner.send({
                    embeds: [Embed.setDescription(`Upon reviewing your blacklist, we've decided to remove your server from our blacklist database.\n
                    All permissions have been reverted back to normal. If you have any questions, join our support discord.\n
                    Please acknowledge that this message is automated and that you will recieve no reply if you respond to this message.`)]
                }).catch(err => console.log("The user who was banned did not receive the message due to DM's being toggled."));
            } else {
                return await interaction.reply({
                    embeds: [Embed.setDescription(`${removeguild} is not blacklisted.`)]
                });
            }
        }
    }
}