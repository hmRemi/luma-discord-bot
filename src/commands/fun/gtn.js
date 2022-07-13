const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const {
    CommandInteraction,
    Permissions,
    MessageEmbed
} = require("discord.js");
const Guild = require(`../../database/models/gtnSchema`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gtn")
        .setDescription("Setup a Guess the Number Event")
        .addChannelOption((option) =>
            option
            .setName("channel")
            .setDescription("Select the Channel for the Event")
            .setRequired(false)
        )
        .addNumberOption((option) =>
            option
            .setName("number")
            .setDescription("What Number should be guessed?")
            .setRequired(false)
        ),
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction) {
        try {
            const ranNum = Math.round(Math.random() * 1000);
            const channel = interaction.options.getChannel("channel") || interaction.channel;
            const number = interaction.options.getNumber("number") || ranNum;

            if (channel.type != "GUILD_TEXT") {
                interaction.reply({
                    content: `This is not a valid channel!`,
                    ephemeral: true,
                });
                return;
            }

            if (number === 0)
                return interaction.reply({
                    content: `Number can't be 0.`,
                    ephemeral: true,
                });

            const isRunning = await Guild.findOne({
                GuildID: interaction.guild.id
            });
            if (isRunning)
                return interaction.reply({
                    content: `A GTN Event is already running.`,
                    ephemeral: true,
                });

            const newEvent = new Guild({
                GuildID: interaction.guild.id,
                Channel: channel.id,
                Number: number,
            });
            newEvent.save();

            const embed = new MessageEmbed()
                .setAuthor("Event Manager", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
                .setDescription(
                    `A new Event has started!\n\nGuess the number between \`1 - 1000\`.`
                )
                .setColor(`#2f3136`)
                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                .setTimestamp();

            await channel.send({
                embeds: [embed]
            });
            // Remove the perms to send any message into the channel 
            interaction.channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                SEND_MESSAGES: true,
                ADD_REACTIONS: true
            });
            return interaction.reply({
                content: `Successfully started Guess the Number Event in ${channel}, number is: ${number}`,
                ephemeral: true,
            });
        
        } catch (err) {
            return Promise.reject(err);
        }
    }
}