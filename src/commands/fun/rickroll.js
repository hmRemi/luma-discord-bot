const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("porn")
        .setDescription("See some nice images"),
    async execute(interaction) {
        try
        {
            const embed = new MessageEmbed()
            .setAuthor("Rick Roller", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
            .setDescription(
                `ahahah LLLL, image being so down bad LOOOL!! get rickrolled!`
            )
            .setColor(`#2f3136`)
            .setImage("https://media.giphy.com/media/g7GKcSzwQfugw/giphy.gif");
    
            await interaction.reply({ embeds: [embed], ephemeral: false });
            return;
        }
        catch (err)
        {
            return Promise.reject(err);
        }
    }
}