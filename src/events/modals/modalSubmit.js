const { Modal } = require("discord-modals");
const { MessageEmbed } = require("discord.js");
const DBSetup = require(`../../database/models/ticketSchema`)
const DB = require(`../../database/models/ticketSetupSchema`)

const {
    createTranscript
} = require("discord-html-transcripts");

module.exports = {
    name: "modalSubmit",
    /**
     * 
     * @param {Modal} modal 
     */
    async execute(modal) {
        if(modal.customId !== "ticketclose") return;
        
        //await modal.deferReply({ephemeral: true });
        
        const reason = modal.getTextInputValue("ticketclose");

        try {
            await DBSetup.findOneAndUpdate({
                GuildID: modal.guild.id
            }, {
                Reason: reason,
            }, {
                new: true,
                upsert: true,
            });

            let docs = await DBSetup.findOne({
                guildID: modal.guild.id
            });

            const TicketSetup = await DB.findOne({
                GuildID: modal.guild.id
            });

            const attachment = await createTranscript(modal.channel, {
                limit: -1,
                returnBuffer: false,
                fileName: `${docs.Type} - ${docs.TicketID}.html`,
            });

            const Embed = new MessageEmbed();
            const Message = await modal.guild.channels.cache.get(TicketSetup.Transcripts).send({
                embeds: [
                    Embed
                    .setAuthor(`Ticket Transcript - ${docs.TicketID}`, "https://media.discordapp.net/attachments/981264899034476644/995720664122130552/image_12.png")
                    .addField(`**User ID**`, `\`\`\`${docs.MembersID}\`\`\``)
                    .addField(`**Reason**`, `\`\`\`${reason}\`\`\``)
                    .addField(`**Type**`, `\`\`\`${docs.Type}\`\`\``)
                    .setColor(`#2f3136`)
                    .setImage("https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG"),
                    
                ],
                files: [attachment],
            });

            modal.channel.send({
                embeds: [
                    Embed.setDescription(
                        `The transcript is now saved [TRANSCRIPT](${Message.url})`
                    ),
                ],
            });

            setTimeout(() => {
                modal.channel.delete();
            }, 10 * 1000);

        } catch (err) {
            console.log(err);
        }
    }
}