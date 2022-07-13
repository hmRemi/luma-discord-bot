const {
    CommandInteraction,
    MessageEmbed,
    Permissions
} = require("discord.js");

const ms = require("ms");

const client = require("../../index")

const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('List giveaway commands.')
        .addSubcommand(subcommand =>
            subcommand
            .setName("start")
            .setDescription("Start a giveaway!")
            .addStringOption((option) =>
                option
                .setName('duration')
                .setDescription('Provide a duration for this giveaway (1m, 1h, 1d).')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
                option
                .setName('winners')
                .setDescription('Select the amount of winners for this giveaway.')
                .setRequired(true)
            )
            .addStringOption((option) =>
                option
                .setName('prize')
                .setDescription('Provide the name of the prize.')
                .setRequired(true)
            )
            .addChannelOption((option) =>
                option
                .setName('channel')
                .setDescription('Select a channel to send the giveaway to.')
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("actions")
            .setDescription("Options for giveaway.")
            .addStringOption((option) =>
                option
                .setName('actions')
                .setDescription('Select an option.')
                .setRequired(true)
                .addChoices(
                    {
                        name: "end",
                        value: "end"
                    }, {
                        name: "pause",
                        value: "pause"
                    }, {
                        name: "unpause",
                        value: "unpause"
                    }, {
                        name: "reroll",
                        value: "reroll"
                    }, {
                        name: "delete",
                        value: "delete"
                    },
                )
            )
            .addStringOption((option) =>
                option
                .setName('message-id')
                .setDescription('Provide the message id of the giveaway.')
                .setRequired(true)
            )
        ),
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction) {

        const {
            options
        } = interaction;

        const Sub = options.getSubcommand();

        const Embed = new MessageEmbed()
            .setAuthor({
                name: `Giveaway Manager`,
                iconURL: 'https://media.discordapp.net/attachments/994998007139414086/995443786018717747/image_6.png',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setColor(`#2f3136`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        switch (Sub) {
            case "start": {
                const gchannel = options.getChannel("channel") || interaction.channel;
                const duration = options.getString("duration");
                const winnerCount = options.getInteger("winners");
                const prize = options.getString("prize");

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    message: {
                        giveaway: "**GIVEAWAY STARTED",
                        giveawayEnded: "**GIVEAWAY ENDED",
                        winMessage: "Congratulations, {winners}! You won **{this.prize}**!"
                    }
                }).then(async () => {
                    Embed.setDescription("Giveaway started successfully.")
                    interaction.reply({
                        embeds: [Embed]
                    });
                }).catch((err) => {
                    Embed.setDescription(`Giveaway issued an error while trying to start.\nError: ${err}`)
                    interaction.reply({
                        embeds: [Embed]
                    });
                });
            }
            break;

            case "actions": {

                const choice = options.getString("actions");
                const messageid = options.getString("message-id");

                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageid);

                // If no giveaway was found
                if (!giveaway) {
                    return interaction.reply({
                        embeds: [Embed.setDescription(`Unable to find the giveaway with the message id : ${messageid} in this guild.`)]
                    });
                }

                switch (choice) {
                    case "end": {
                        client.giveawaysManager
                            .end(messageid)
                            .then(() => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription("Successfully ended giveaway!")]
                                });
                            })
                            .catch((err) => {
                                returninteraction.reply({
                                    embeds: [Embed.setDescription(`Error occured while ending giveaway.\n\`${err}\``)]
                                });
                            });
                    }
                    break;

                    case "pause": {
                        client.giveawaysManager
                            .pause(messageid)
                            .then(() => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription("Successfully paused giveaway!")]
                                });
                            })
                            .catch((err) => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription(`Error occured while pausing giveaway.\n\`${err}\``)]
                                });
                            });

                    }
                    break;

                    case "unpause": {
                        client.giveawaysManager
                            .unpause(messageid)
                            .then(() => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription("Successfully unpaused giveaway!")]
                                });
                            })
                            .catch((err) => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription(`Error occured while unpausing giveaway.\n\`${err}\``)]
                                });
                            });
                    }
                    break;

                    case "reroll": {
                        client.giveawaysManager
                            .reroll(messageid)
                            .then(() => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription("Successfully rerolled giveaway!")]
                                });
                            })
                            .catch((err) => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription(`Error occured while rerolling giveaway.\n\`${err}\``)]
                                });
                            });
                    }
                    break;

                    case "delete": {
                        client.giveawaysManager.delete(messageid)
                            .then(() => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription("Successfully deleted giveaway!")]
                                });
                            })
                            .catch((err) => {
                                return interaction.reply({
                                    embeds: [Embed.setDescription(`Error occured while deleting giveaway.\n\`${err}\``)]
                                });
                            });
                }
            }
        }
        break;

        default: {
            console.log("Error in giveaway command.");
        }
        }
    }
}