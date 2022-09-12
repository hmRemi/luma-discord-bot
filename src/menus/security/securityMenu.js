const {
    default: mongoose
} = require("mongoose");

const {
    MessageEmbed,
    MessageSelectMenu,
    MessageActionRow
} = require('discord.js');

const Settings = require(`../../database/models/securitySchema`);

module.exports = {
    data: {
        name: "security-select",
    },
    async execute(interaction, client) {

        const {
            guild
        } = interaction;

        // Fetch the previous message sent.
        let msg = await interaction.channel.messages.fetch(interaction.message.id);

        const embed = new MessageEmbed();
        embed.setTitle("${guild.name} | Security Settings")

        // If menu equals to "security-select", then listen to the message.
        
        if (interaction.values[0] === "antispam") {

            // Search for a guild profile containing a guild id.
            let settings = await Settings.findOne({
                GuildID: guild.id,
            });

            // If the settings profile doesn't exist, create it.
            if (!settings) {
                settings = await new Settings({
                    _id: mongoose.Types.ObjectId(),
                    GuildID: guild.id,
                });
                return await settings.save().catch(err => console.log(err));
            }

            // Change embed details.
            embed.setTitle(`${guild.name} | Anti Spam Settings`)
                .addField('Anti Spam', `\`\`\`${settings.AntiSpam}\`\`\``, true)

                .addField('Anti Spam Count', `\`\`\`${settings.AntiSpamCount}\`\`\``, true)
                .addField('Anti Spam Time', `\`\`\`${settings.AntiSpamTime}\`\`\``, true)
                .addField('Anti Spam Message', `\`\`\`${settings.AntiSpamMessage}\`\`\``, true)

                .addField('Anti Spam Timeout', `\`\`\`${settings.AntiSpamTimeout}\`\`\``, true)
                .addField('Anti Spam Timeout Time', `\`\`\`${settings.AntiSpamTimeoutTime}\`\`\``, true)
                .addField('Anti Spam Timeout Message', `\`\`\`${settings.AntiSpamTimeoutMessage}\`\`\``, true)

                .addField('Anti Spam Kick', `\`\`\`${settings.AntiSpamKick}\`\`\``, true)
                .addField('Anti Spam Kick Message', `\`\`\`${settings.AntiSpamKickMessage}\`\`\``, true)


            // Edit the previous message with the new embed.
            msg.edit({
                embeds: [embed]
            });
        } else if (interaction.values[0] === "antiinvite") {

            // Search for a guild profile containing a guild id.
            let settings = await Settings.findOne({
                GuildID: guild.id,
            });

            // If the settings profile doesn't exist, create it.
            if (!settings) {
                settings = await new Settings({
                    _id: mongoose.Types.ObjectId(),
                    GuildID: guild.id,
                });
                return await settings.save().catch(err => console.log(err));
            }

            // Change embed details.
            embed.setTitle(`${guild.name} | Anti Invite Settings`)
            .addField('Anti Invite', `\`\`\`${settings.AntiInvite}\`\`\``, true)
            .addField('Anti Invite Message', `\`\`\`${settings.AntiInviteMessage}\`\`\``, true)
            .addField('Anti Invite Timeout', `\`\`\`${settings.AntiInviteTimeout}\`\`\``, true)
            .addField('Anti Invite Kick', `\`\`\`${settings.AntiInviteKick}\`\`\``, true)
            .addField('Anti Invite Kick Message', `\`\`\`${settings.AntiInviteKickMessage}\`\`\``, true)

            // Edit the previous message with the new embed.
            msg.edit({
                embeds: [embed]
            });
        }

        /*const antiinvite = new MessageEmbed()
                .setTitle(`${guild.name} | Anti Invite Settings`)
                .addField('Anti Invite', `\`\`\`${settings.AntiInvite}\`\`\``, true)
                .addField('Anti Invite Message', `\`\`\`${settings.AntiInviteMessage}\`\`\``, true)
                .addField('Anti Invite Timeout', `\`\`\`${settings.AntiInviteTimeout}\`\`\``, true)
                .addField('Anti Invite Kick', `\`\`\`${settings.AntiInviteKick}\`\`\``, true)
                .addField('Anti Invite Kick Message', `\`\`\`${settings.AntiInviteKickMessage}\`\`\``, true)*/
    }
}