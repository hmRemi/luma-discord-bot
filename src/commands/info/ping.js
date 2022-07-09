const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bots ping!'),
    async execute(interaction) {

        const embed = new MessageEmbed()
            .setTitle("Ping")
            .addField(`Bot Latency:`, `\`\`\`${interaction.client.ws.ping}ms\`\`\``)
            .setColor(`#2f3136`);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }
}