const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Returns info based on input')
        .addSubcommand(subcommand =>
            subcommand
            .setName("user")
            .setDescription("Gets information of a user mentioned")
            .addUserOption(option => option.setName("target").setDescription("The user mentioned")))
        .addSubcommand(subcommand =>
            subcommand
            .setName("server")
            .setDescription("Gets information of the server")),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === "user") {
            const user = interaction.options.getUser("target");
            if (user) {
                const embed = new MessageEmbed()
                    .setTitle(`Information about: ${user.username}#${user.discriminator}`)
                    .addField(`User Id`, `\`\`\`${user.id}\`\`\``)
                    .setColor(`#2f3136`)
                    .setFooter(`Requested by ${interaction.user.username}`)

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            } else {
                const embed = new MessageEmbed()
                    .setTitle(`Information about: ${interaction.user.username}#${interaction.user.discriminator}`)
                    .addField(`User Id`, `\`\`\`${interaction.user.id}\`\`\``)
                    .setColor(`#2f3136`)
                    .setFooter(`Requested by ${interaction.user.username}`)

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        } else if (interaction.options.getSubcommand() === "server") {

            const {
                createdTimestamp,
                ownerID,
                description
            } = interaction.guild;
            
            const embed = new MessageEmbed()
                //.setTitle(`Information about: ${interaction.guild.name}`)
                //.addField(`Total Members`, `\`\`\`${interaction.guild.memberCount}\`\`\``)
                .addFields({
                    name: "GENERAL",
                    value: `
                    Name: ${interaction.guild.name}
                    Created <t:${parseInt(createdTimestamp / 1000)}:R>
                    Total Members: ${interaction.guild.memberCount}

                    Description: ${description}
                    `
                })
                .setColor(`#2f3136`)
                .setFooter(`Requested by ${interaction.user.username}`)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}