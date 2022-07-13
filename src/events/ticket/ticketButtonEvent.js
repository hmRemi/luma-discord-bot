const {
    ButtonInteraction,
    MessageEmbed,
    Client,
} = require("discord.js");

const {
    Modal, TextInputComponent, showModal 
} = require("discord-modals");

const {
    createTranscript
} = require("discord-html-transcripts");
const DB = require(`../../database/models/ticketSchema`)
const DBSetup = require(`../../database/models/ticketSetupSchema`)

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        const {
            guild,
            customId,
            channel,
            member
        } = interaction;

        if(!["close", "lock", "unlock"].includes(customId)) return;

        const TicketSetup = await DBSetup.findOne({
            GuildID: guild.id
        });

        if(!TicketSetup) return interaction.channel.send("The data for this system is outdated")

        if(!member.roles.cache.find((r) => r.id === TicketSetup.Handlers)) return interaction.channel.send({
            content: "You can't use these buttons.",
            ephemeral: true,
        });

        const Embed = new MessageEmbed().setColor(`#2f3136`);

        DB.findOne({ChannelID: channel.id}, async (err, docs) => {
            if (err) throw err;
            if (!docs) 
            return interaction.channel.send({
                content: "No data was found related to this ticket, please delete manually.",
                ephemeral: true,
            });
        switch (customId) {
            case "lock":
                if (docs.Locked == true)
                    return interaction.channel.send({
                        content: "The ticket is already locked",
                        ephemeral: true,
                    });

                await DB.updateOne({ ChannelID: channel.id}, { Locked: true });
                Embed.setDescription("This ticket is now locked for reviewing.");

                docs.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, {
                        SEND_MESSAGES: false,
                    });
                });
                
                return interaction.reply({
                    embeds: [Embed]
                });
                break;
            case "unlock":
                if (docs.Locked == false)
                    return interaction.channel.send({
                        content: "The ticket is already unlocked.",
                        ephemeral: true,
                    });
                await DB.updateOne({
                    ChannelID: channel.id
                }, {
                    Locked: false
                });
                Embed.setDescription("This ticket is now unlocked.");

                docs.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, {
                        SEND_MESSAGES: true,
                    });
                });
                
                return interaction.channel.send({
                    embeds: [Embed]
                });
                break;
            case "close":
                if(!TicketSetup.Transcripts) return interaction.channel.send("You must setup the transcripts channel.");

                if (docs.Closed == true)
                    return;

                await DB.updateOne({
                    ChannelID: channel.id,
                }, {
                    Closed: true
                });
            }
        })
    }
}