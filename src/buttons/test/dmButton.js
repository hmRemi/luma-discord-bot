const { Modal, TextInputComponent, showModal } = require("discord-modals")
const { Client } = require("discord.js");
const DBSetup = require(`../../database/models/ticketSchema`)

module.exports = {
    id: "sendmsg",
    permission: "ADMINISTRATOR",
    async execute(interaction, client) {

        const modal = new Modal()
        .setCustomId("directmessage")
        .setTitle("Save ticket transcript")
        .addComponents(
            new TextInputComponent()
            .setCustomId("dm-content")
            .setLabel("Input reason of closure")
            .setStyle("SHORT")
            .setMinLength(1)
            .setPlaceholder("Input reason")
            .setRequired(true),
            new TextInputComponent()
            .setCustomId("dm-id")
            .setLabel("ID of User")
            .setStyle("SHORT")
            .setMinLength(1)
            .setPlaceholder("Input ID")
            .setRequired(true)
        );

        showModal(modal, {
            client: client,
            interaction: interaction,
        });

    }
}