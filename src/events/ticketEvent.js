const {
    ButtonInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} = require("discord.js");

const DB = require(`../database/models/ticketSchema`)
const DBSetup = require(`../database/models/ticketSetupSchema`)


module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const {
            guild,
            member,
            customId
        } = interaction;

        const Data = await DBSetup.findOne({
            GuildID: guild.id
        });
        if(!Data) return;
        if(!Data.Buttons.includes(customId)) return;

        const ID = Math.floor(Math.random() * 90000) + 10000;

        if(!Data.Category) return interaction.reply("You must setup the category");
        if(!Data.Everyone) return interaction.reply("You must setup the everyone role");


        await guild.channels.create(`${customId + "-" + ID}`, {
            type: "GUILD_TEXT",
            parent: Data.Category,
            permissionOverwrites: [{
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: Data.Handlers,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: Data.Everyone,
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                }
            ],
        })
        .then(async (channel) => {
            await DB.create({
                GuildID: guild.id,
                MembersID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
            });

            const Embed = new MessageEmbed()
                .setAuthor(`${guild.name} | Ticket: ${ID}`,
                    guild.iconURL({
                        dynamic: true
                    })
                )
                .setDescription("Please wait patiently for a response from the Staff Team, in the mean while, describe your issue in as much detail as possible.")
                .setColor(`#2f3136`)
                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

            const buttons = new MessageActionRow();
            buttons.addComponents(
                new MessageButton()
                .setCustomId('close')
                .setLabel('Save & Close')
                .setStyle('PRIMARY'),

                new MessageButton()
                .setCustomId('lock')
                .setLabel('Lock')
                .setStyle('SECONDARY'),

                new MessageButton()
                .setCustomId('unlock')
                .setLabel('Unlock')
                .setStyle('SECONDARY'),
            );

            channel.send({
                embeds: [Embed],
                components: [buttons]
            });

            await channel.send({
                content: `${member}`
            }).then((m) => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                }, 1 * 2000);
            });
        });
    },
};