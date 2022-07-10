const { Modal, TextInputComponent, showModal } = require("discord-modals")
const { Client } = require("discord.js");
const DBSetup = require(`../../database/models/ticketSchema`)

module.exports = {
    id: "close",
    permission: "ADMINISTRATOR",
    async execute(interaction, client) {

        const modal = new Modal()
        .setCustomId("ticketclose")
        .setTitle("Save ticket transcript")
        .addComponents(
            new TextInputComponent()
            .setCustomId("ticketclose")
            .setLabel("Input reason of closure")
            .setStyle("SHORT")
            .setMinLength(1)
            .setPlaceholder("Input reason")
            .setRequired(true)
        );

        showModal(modal, {
            client: client,
            interaction: interaction,
        });

    }
}