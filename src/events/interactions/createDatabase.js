const {
    MessageAttachment,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    WebhookClient,
    GuildMember
} = require("discord.js");
const {
    Captcha
} = require("captcha-canvas");

const {
    default: mongoose
} = require("mongoose");

const Guild = require(`../../database/models/guildSchema`)
const TicketSetup = require(`../../database/models/ticketSetupSchema`);
const Premium = require(`../../database/models/premiumSchema`);
const Verify = require(`../../database/models/verifySchema`);


module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {

            if(interaction.guild.id == null) return;

            // Search for a guild profile containing a guild id.
            let guildProfile = await Guild.findOne({
                guildID: interaction.guild.id
            });

            // If there is no guild profile, create with guild name and id.
            if (!guildProfile) {
                guildProfile = await new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id,
                    guildName: interaction.guild.name
                });
                await guildProfile.save().catch(err => console.log(err));
            }

            // Search for a guild profile containing a guild id.
            let verifyProfile = await Verify.findOne({
                GuildID: interaction.guild.id
            });

            // If there is no guild profile, create with guild name and id.
            if (!verifyProfile) {
                verifyProfile = await new Verify({
                    _id: mongoose.Types.ObjectId(),
                    GuildID: interaction.guild.id,
                });
                await verifyProfile.save().catch(err => console.log(err));
            }

            // Search for a ticket profile containing a guild id.
            let ticketProfile = await TicketSetup.findOne({
                GuildID: interaction.guild.id
            });

            // If there is no ticket profile, create with id.
            if (!ticketProfile) {
                ticketProfile = await new TicketSetup({
                    _id: mongoose.Types.ObjectId(),
                    GuildID: interaction.guild.id,
                });
                await ticketProfile.save().catch(err => console.log(err));
            }
        }
    }
}