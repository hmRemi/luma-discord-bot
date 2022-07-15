const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    Permissions,
    MessageEmbed,
    MessageSelectMenu,
    MessageActionRow
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('security')
        .setDescription('Shows guild security settings')
        .addSubcommand(subcommand =>
            subcommand
            .setName("settings")
            .setDescription("List all settings")
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setantispam")
            .setDescription("Enables/disables antispam")
            .addStringOption((option) =>
                option
                .setName('setantispam')
                .setDescription('Enable/disable antispam')
                .setRequired(true)
                .addChoices({
                    name: "enable",
                    value: "enable"
                }, {
                    name: "disable",
                    value: "disable"
                }, )
            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspamcount")
            .setDescription("Number of messages to be considered spam")
            .addStringOption(option => option.setName("count").setDescription("The number of messages to be considered spam"))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspamtime")
            .setDescription("How long to wait between messages")
            .addStringOption(option => option.setName("time").setDescription("The time to wait between messages"))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspammessage")
            .setDescription("Message to be sent when a user is considered spam")
            .addStringOption(option => option.setName("message").setDescription("The message to be sent when a user is considered spam"))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspammute")
            .setDescription("Enables/disables muting users when they are considered spam")
            .addStringOption((option) =>
                option
                .setName('setspammute')
                .setDescription('Enable/disable muting users when they are considered spam')
                .setRequired(true)
                .addChoices({
                    name: "enable",
                    value: "enable"
                }, {
                    name: "disable",
                    value: "disable"
                }, )
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspammutetime")
            .setDescription("How long to mute users for")
            .addStringOption(option => option.setName("setspammutetime").setDescription("The time to mute users for"))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspammutemessage")
            .setDescription("Message to be sent when a user is muted")
            .addStringOption(option => option.setName("setspammutemessage").setDescription("The message to be sent when a user is muted"))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspamkick")
            .setDescription("Enables/disables anti spam kick")
            .addStringOption((option) =>
                option
                .setName('setspamkick')
                .setDescription('Select an option.')
                .setRequired(true)
                .addChoices({
                    name: "enable",
                    value: "enable"
                }, {
                    name: "disable",
                    value: "disable"
                }, )
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setspamkickmessage")
            .setDescription("Message to be sent when a user is kicked")
            .addStringOption(option => option.setName("setspamkickmessage").setDescription("The message to be sent when a user is kicked"))
        ),


    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    botpermissions: [Permissions.FLAGS.MANAGE_GUILD],
    async execute(interaction, client) {
        const guild = interaction.guild;

        const mainEmbed = new MessageEmbed()
            .setTitle(`Security Settings for ${guild.name}`)
            .setDescription("Here are the current security settings for this guild.")

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('security-select')
                .setPlaceholder('Select a setting')
                .setOptions([{
                        label: "Anti Spam",
                        value: "antispam",
                        description: "Configure Anti Spam Settings"
                    },
                    {
                        label: "Anti Invite",
                        value: "antinvite",
                        description: "Configure Anti Invite"
                    },
                    {
                        label: "Anti Link",
                        value: "antilink",
                        description: "Configure Anti Link"
                    },
                ]),

            )


        const Sub = interaction.options.getSubcommand();

        switch (Sub) {
            case "settings": {
                const msg = interaction.reply({
                    embeds: [mainEmbed],
                    components: [row]

                });
            }
        }
    }
}