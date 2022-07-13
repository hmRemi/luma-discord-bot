const {
    CommandInteraction,
    MessageEmbed,
    InteractionCollector
} = require("discord.js");
const client = require("../../index")
const {
    SlashCommandBuilder,
    SlashCommandStringOption
} = require('@discordjs/builders');
const {
    RepeatMode
} = require("distube");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Play music')
        .addSubcommand((subcommand) =>
            subcommand
            .setName('play')
            .setDescription('Play a song')
            .addStringOption((option) =>
                option
                .setName('query')
                .setDescription('Input name or url')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('skip')
            .setDescription('Skip a song')
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('stop')
            .setDescription('Stop playing music')
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('search')
            .setDescription('Search a song')
            .addStringOption((option) =>
                option
                .setName('search')
                .setDescription('Input name or url')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('repeat')
            .setDescription('Set music on repeat')
            .addStringOption((option) =>
                option
                .setName('repeat')
                .setDescription('QUEUE/SONG/OFF')
                .setRequired(true)
                .addChoices({
                    name: "QUEUE",
                    value: "repeatqueue"
                }, {
                    name: "SONG",
                    value: "repeatsong"
                }, {
                    name: "OFF",
                    value: "off"
                }, ),
            ),
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('filter')
            .setDescription('Chane music filter')
            .addStringOption((option) =>
                option
                .setName('filter')
                .setDescription('3D/BASSBOOST/ECHO/KARAOKE/NIGHTCORE/VAPORWAVE')
                .setRequired(true)
                .addChoices({
                        name: "3D",
                        value: "3d"
                    }, {
                        name: "BASSBOOST",
                        value: "bassboost"
                    }, {
                        name: "ECHO",
                        value: "echo"
                    }, {
                        name: "KARAOKE",
                        value: "karaoke"
                    }, {
                        name: "NIGHTCORE",
                        value: "nightcore"
                    }, {
                        name: "DEPRESSION",
                        value: "vaporwave"
                    }, {
                        name: "DEPRESSION BASS",
                        value: "bassvaporwave"
                    }, {
                        name: "OFF",
                        value: "filteroff"
                    },

                ),
            ),
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('volume')
            .setDescription('Change the volume')
            .addIntegerOption((option) =>
                option
                .setName('percent')
                .setDescription('Set the percent')
                .setRequired(true),
            ),
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("settings")
            .setDescription("List all music settings")
            .addStringOption((option) =>
                option
                .setName('options')
                .setDescription('Select an option.')
                .setRequired(true)
                .addChoices({
                        name: "queue",
                        value: "queue"
                    }, 
                    {
                        name: "pause",
                        value: "pause"
                    }, 
                    {
                        name: "resume",
                        value: "resume"
                    }, 
                    {
                        name: "previous",
                        value: "previous"
                    },
                    {
                        name: "nowplaying",
                        value: "nowplaying"
                    },

                ),
            )
        ),
    premium: true,
    async execute(interaction) {
        const {
            options,
            member,
            guild,
            channel
        } = interaction;

        const VoiceChannel = member.voice.channel;

        const messageEmbed = new MessageEmbed()
            .setAuthor({
                name: `Music Manager`,
                iconURL: 'https://media.discordapp.net/attachments/994998007139414086/995443786018717747/image_6.png',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setColor(`#2f3136`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

        if (!VoiceChannel) return interaction.reply({
            embeds: [messageEmbed.setDescription("You must be in a channel.")],
            ephemeral: true,
        })

        if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return interaction.reply({
            embeds: [messageEmbed.setDescription(`I'm already playing music in <#${guild.me.voice.channelId}>`)],
            ephemeral: true,
        })

        try {
            switch (options.getSubcommand()) {
                case "skip":
                    await client.distube.skip(VoiceChannel);
                    return interaction.reply({
                        embeds: [messageEmbed.setDescription(`Song has been skipped.`)],
                    });
                case "stop":
                    await client.distube.stop(VoiceChannel);
                    return interaction.reply({
                        embeds: [messageEmbed.setDescription(`Music has been stopped.`)],
                    });
                case "play": {
                    client.distube.play(VoiceChannel, options.getString("query"), {
                        textChannel: channel,
                        member: member
                    });
                    return interaction.reply({
                        embeds: [messageEmbed.setDescription(`Searching for song...!`)],
                    });
                }
                case "search": {
                    let result = await client.distube.search(`${options.getString("search")}`);

                    //create variable
                    let searchresult = "";

                    for (let i = 0; i < 10; i++) {
                        try {
                          searchresult += await `**${i + 1}**. [${result[i].name}](${
                            result[i].url
                          }) - \`${result[i].formattedDuration}\`\n`;
                        } catch {
                          searchresult += await " ";
                        }
                      }

                    let userinput = 10;
                    return interaction.reply({
                        embeds: [messageEmbed.setDescription(`[${result[userinput - 1].name}](${result[userinput - 1].url})`)],
                    });
                    /*return interaction.reply({
                        embeds: [messageEmbed.setDescription(`[${result[userinput - 1].name}](${result[userinput - 1].url})`).setThumbnail(result[userinput - 1].thumbnail)],
                    });*/
                    //embedbuilder(client, interaction, "#fffff0", "Searching!", `[${result[userinput - 1].name}](${result[userinput - 1].url})`, result[userinput - 1].thumbnail)
                }
                case "volume": {
                    const Volume = options.getInteger("percent");

                    if (Volume > 200 | Volume < 1)
                        return interaction.reply({
                            embeds: [messageEmbed.setDescription(`You have to specify a number between 1-200.`)],
                        });

                    client.distube.setVolume(VoiceChannel, Volume);
                    return interaction.reply({
                        embeds: [messageEmbed.setDescription(`Volume has been set to \`${Volume}%\``)],
                    })
                }
                case "repeat": {
                    switch (options.getString("repeat")) {
                        case "off":
                            client.distube.setRepeatMode(VoiceChannel, RepeatMode.DISABLED);
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set repeat mode to **OFF**`)],
                            });
                        case "repeatsong":
                            client.distube.setRepeatMode(VoiceChannel, RepeatMode.SONG);
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set repeat mode to **SONG**`)],
                            });
                        case "repeatqueue":
                            client.distube.setRepeatMode(VoiceChannel, RepeatMode.QUEUE);
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set repeat mode to **QUEUE**`)],
                            });
                    }
                }
                case "filter": {
                    switch (options.getString("filter")) {
                        case "filteroff":
                            client.distube.setFilter(VoiceChannel, false);
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **OFF**`)],
                            });
                        case "bassboost":
                            client.distube.setFilter(VoiceChannel, false);
                            client.distube.setFilter(VoiceChannel, "bassboost");
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **BASS BOOST**`)],
                            });
                        case "nightcore":
                            client.distube.setFilter(VoiceChannel, false);
                            client.distube.setFilter(VoiceChannel, "nightcore");
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **NIGHTCORE**`)],
                            });
                        case "karaoke":
                            client.distube.setFilter(VoiceChannel, false);
                            client.distube.setFilter(VoiceChannel, "karaoke");
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **KARAOKE**`)],
                            });
                        case "3d":
                            client.distube.setFilter(VoiceChannel, false);
                            client.distube.setFilter(VoiceChannel, "3d");
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **3D**`)],
                            });
                        case "vaporwave":
                            client.distube.setFilter(VoiceChannel, false);
                            client.distube.setFilter(VoiceChannel, "vaporwave");
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **DEPRESSION**`)],
                            });
                        case "bassvaporwave":
                            client.distube.setFilter(VoiceChannel, false);
                            client.distube.setFilter(VoiceChannel, "bassboost");
                            client.distube.setFilter(VoiceChannel, "vaporwave");
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **DEPRESSION BASS**`)],
                            });
                        case "echo":
                            client.distube.setFilter(VoiceChannel, false);
                            client.distube.setFilter(VoiceChannel, "echo");
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Set filter mode to **ECHO**`)],
                            });
                    }
                }
                case "settings": {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if (!queue)
                        return interaction.reply({
                            embeds: [messageEmbed.setDescription(`There is no queue.`)],
                        });

                    const status = queue =>
                        `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
                        queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
                    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

                    switch (options.getString("options")) {
                        case "previous":
                            await queue.previous(VoiceChannel);
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Playing previous song...`)],
                            });
                        case "nowplaying":
                            const song = queue.songs[0]
                            return interaction.reply({ embeds: [messageEmbed
                                .setDescription(`[${song.name}](${song.url})`)
                                .addField("**Views:**", song.views.toString(), true)
                                .addField("**Like:**", song.likes.toString(), true)
                                .addField("**Duration:**", `${queue.formattedCurrentTime} / ${song.formattedDuration}`)
                                .addField("**Link**", `[Download This Song](${song.streamURL})`)
                                .addField("**Status**", status(queue).toString())
                                .setThumbnail(song.thumbnail)
                                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })] 
                        })
                        
                        case "pause":
                            await queue.pause(VoiceChannel);
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Song has been paused.`)],
                            });
                        case "resume":
                            await queue.resume(VoiceChannel);
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`Song has been resumed.`)],
                            });
                        case "queue":
                            return interaction.reply({
                                embeds: [messageEmbed.setDescription(`${status(queue)} \n${queue.songs.map((song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`)]
                            })
                    }
                }
            }
        } catch (error) {
            const errorEmbed = new MessageEmbed()
                .setColor(`#2f3136`)
                .setDescription(`Alert: ${error}`)

            return interaction.reply({
                embeds: [errorEmbed]
            });
        }
    }
}

function embedbuilder(client, message, color, title, description, thumbnail) {
    try {
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL({
                dynamic: true
            }), "t")
            .setFooter(client.user.username, client.user.displayAvatarURL());
        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (thumbnail) embed.setThumbnail(thumbnail)
        return message.channel.send(embed);
    } catch (error) {
        console.error
    }
}