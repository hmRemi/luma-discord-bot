const Guild = require(`../../database/models/gtnSchema`);

const {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    Discord,
    ReactionUserManager,
} = require("discord.js");

const {
    GuildMember,
    MessageEmbed,
    MessageFlags,
    DiscordAPIError
} = require("discord.js");

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        try {
            if (message.author.bot) return;

            if(message.guild.id == null) return;

            // If no setup, don't do anything.
            const isRunning = await Guild.findOne({
                GuildID: message.guild.id
            });
            if (!isRunning) return;

            const guildgame = message.client.guilds.cache.get(message.guild.id);
            const gamechannel = guildgame.channels.cache.get(isRunning.Channel);

            // Only accept numbers, if the guess is correct, return a message.
            if (Number.isInteger(parseInt(message.content)) && parseInt(message.content) == isRunning.Number && message.channel.id == gamechannel) {
                message.pin().catch(error => {
                    if (error instanceof DiscordAPIError) return message.reply({
                        content: `Correct Number!\n\n**Warning: Unable to pin message**`
                    })
                })

                const embed = new MessageEmbed()
                .setAuthor("Event Manager", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
                .setDescription(
                    `Congratulations ${message.author}, you've guessed the number!\nNumber was: ${message.content}`
                )
                .setColor(`#2f3136`)
                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                .setTimestamp();


                // Remove the perms to send any message into the channel 
                message.channel.permissionOverwrites.create(message.guild.roles.everyone, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });

                message.react("✅").catch(error => console.log(error));
                message.reply({
                    embeds: [embed]
                });
                isRunning.delete(); // Delete saved data from the db as it's not needed anymore.
            } else return;
        } catch (err) {
            return Promise.reject(err);
        }
    }
}