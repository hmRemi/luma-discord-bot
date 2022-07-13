const { ButtonInteraction } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction, client) {
        if(!interaction.isButton()) return;
        const Button = client.buttons.get(interaction.customId);
        if(!Button) return;

        if(!Button.permission && !interaction.member.permissions.has(Button.permission)) 
        return interaction.reply({content: "no perms"}, {ephemeral: true});

        if(Button.execute(interaction, client));
    }
}