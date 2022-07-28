const client = require("../../index")

const {
    CommandInteraction,
    MessageEmbed,
    InteractionCollector
} = require("discord.js");

const {
    SlashCommandBuilder,
    SlashCommandStringOption
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Send list of guilds the bot is in'),
    owner: true,
    async execute(interaction) {

        client.guilds.cache.forEach(guild => {
            interaction.channel.send(`${guild.name} | ${guild.id}`);
        });
    }
}