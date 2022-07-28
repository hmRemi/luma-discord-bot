const client = require("../../index")
const {
    MessageEmbed
} = require("discord.js");

const status = queue =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

const messageEmbed = new MessageEmbed()
    .setAuthor({
        name: `Music Manager`,
        iconURL: 'https://media.discordapp.net/attachments/994998007139414086/995443786018717747/image_6.png',
        url: 'https://discord.gg/ma6TcSambz'
    })
    .setColor(`#2f3136`)
    .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

client.distube
    /*.on('playSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [messageEmbed
                .setDescription(`[${song.name}](${song.url})`)
                .addField("**Views:**", song.views.toString(), true)
                .addField("**Like:**", song.likes.toString(), true)
                .addField("**Duration:**", `${queue.formattedCurrentTime} / ${song.formattedDuration}`)
                .addField("**Link**", `[Download This Song](${song.streamURL})`)
                .addField("**Status**", status(queue).toString())
                .setThumbnail(song.thumbnail)
                .setFooter({
                    text: `Requested by ${song.user}`,
                    iconURL: song.user.avatarURL()
                })
            ]

        }))*/

    .on('playSong', (queue, song) =>
        queue.textChannel?.send({
            embeds: [messageEmbed
                .setDescription(`Now playing [${song.name}](${song.url})\n${status(queue)}`)
            ]
        }),

    )

    .on('addSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [messageEmbed
                .setDescription(`Added [${song.name}](${song.url}) to the queue.\n${status(queue)}`)
                .setThumbnail(song.thumbnail)]
        }))

    .on('addList', (queue, playlist) =>
        queue.textChannel.send({
            embeds: [messageEmbed.setDescription(` | Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`)]
        }))

    .on('error', (channel, e) => {
        channel.send({
            embeds: [messageEmbed.setDescription(` | An error encountered: ${e.toString().slice(0, 1974)}`)]
        })
        console.error(e)
    })

    .on('empty', channel =>
        console.log(`No one in channel`)
    )
    .on("searchResult", (message, results) => {
        message.channel.send(`**Choose an option from below**\n${
    results.map((song, i) => `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    .on('searchNoResult', (message, query) =>
        message.channel.send({
            embeds: [messageEmbed.setDescription(` | No result found for \`${query}\`!`)]
        }))
    .on("searchCancel", (message) => messageEmbed.setDescription(`Searching canceled: ${message}`, ""))

    .on('finish', queue =>
        queue.textChannel.send({
            embeds: [messageEmbed.setDescription(`Finished!`)]
        }))