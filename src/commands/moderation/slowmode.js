const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode for a channel')
        .addStringOption(option => option.setName('duration').setRequired(true).setDescription(`Set a duration for the slowmode.`)),
    async execute(interaction) {
        let duration = Number(interaction.options.getString('duration'));

        const embed = new MessageEmbed()
            .setTitle("Changed Slowmode!")
            .addField(`Duration:`, `\`\`\`${duration} second(s)\`\`\``)
            .setColor(`#2f3136`);

        interaction.channel.setRateLimitPerUser(duration);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }
}