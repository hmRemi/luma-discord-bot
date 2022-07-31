const client = require("../../index")

const load = require('lodash');

const {
    MessageEmbed,
    MessageButton,
    MessageActionRow,
} = require("discord.js");

const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Send list of guilds the bot is in'),
    owner: true,
    async execute(interaction) {
        const serverlist = client.guilds.cache.sort((a, b) => b.id - a.id).sort((a, b) => b.memberCount - a.memberCount).map(guild => guild).map((guild, i) =>
            `\`${i+++1}.\` **${guild.name}** - \`${guild.id}\` | ${guild.memberCount} Members`
        );
        const mapping = load.chunk(serverlist, 10);
        const pages = mapping.map((s) => s.join('\n'));
        let page = 0;

        const embed2 = new MessageEmbed()
            .setColor("#2f3136")
            .setDescription(`${pages[page]}`)

            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL({
                    dynamic: true
                }),
            })
            .setAuthor({
                name: `${client.user.username}'s Bot`,
                iconURL: client.user.avatarURL({
                    dynamic: true
                })
            })
            .setTitle(`Total Servers: ${client.guilds.cache.size} | Total Users: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} | Page: ${page + 1}/${pages.length}`);

        const but1 = new MessageButton()
            .setCustomId('queue_cmd_but_1')
            .setLabel('NEXT')
            .setStyle('SUCCESS');

        const but2 = new MessageButton()
            .setCustomId('queue_cmd_but_2')
            .setLabel('PREVIOUS')
            .setStyle('SUCCESS');

        const but3 = new MessageButton()
            .setCustomId('queue_cmd_but_3')
            .setLabel(`${page + 1}/${pages.length}`)
            .setDisabled(true)
            .setStyle('SECONDARY');

        const row1 = new MessageActionRow().addComponents([but2, but3, but1]);

        const msg = await interaction.channel.send({
            embeds: [embed2],
            components: [row1]
        });
        interaction.deferReply({
            ephemeral: true
        });

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (b) => {
                if (b.user.id === interaction.member.user.id) return true;
                else {
                    b.reply({
                        ephemeral: true,
                        content: `Only **${interaction.member.user.tag}** can use this button, if you want then you've to run the command again.`,
                    });
                    return false;
                }
            },
            time: 60000 * 5,
            idle: 30e3,
        });

        collector.on('collect', async (button) => {
            if (button.customId === 'queue_cmd_but_1') {
                await button.deferUpdate().catch(() => {});
                page = page + 1 < pages.length ? ++page : 0;
                const but1 = new MessageButton()
                    .setCustomId('queue_cmd_but_1')
                    .setLabel('NEXT')
                    .setStyle('SUCCESS');

                const but2 = new MessageButton()
                    .setCustomId('queue_cmd_but_2')
                    .setLabel('PREVIOUS')
                    .setStyle('SUCCESS');

                const but3 = new MessageButton()
                    .setCustomId('queue_cmd_but_3')
                    .setLabel(`${page + 1}/${pages.length}`)
                    .setDisabled(true)
                    .setStyle('SECONDARY');

                const row1 = new MessageActionRow().addComponents([but2, but3, but1]);

                const embed3 = new MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(pages[page])

                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL({
                            dynamic: true
                        }),
                    })
                    .setAuthor({
                        name: `${client.user.username}'s Bot`,
                        iconURL: client.user.avatarURL({
                            dynamic: true
                        })
                    })
                    .setTitle(`Total Servers: ${client.guilds.cache.size} | Total Users: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} | Page: ${page + 1}/${pages.length}`);

                await msg.edit({
                    embeds: [embed3],
                    components: [row1]
                });
            } else if (button.customId === 'queue_cmd_but_2') {
                await button.deferUpdate().catch(() => {});
                page = page > 0 ? --page : pages.length - 1;

                const but1 = new MessageButton()
                    .setCustomId('queue_cmd_but_1')
                    .setLabel('NEXT')
                    .setStyle('SUCCESS');

                const but2 = new MessageButton()
                    .setCustomId('queue_cmd_but_2')
                    .setLabel('PREVIOUS')
                    .setStyle('SUCCESS');

                const but3 = new MessageButton()
                    .setCustomId('queue_cmd_but_3')
                    .setLabel(`${page + 1}/${pages.length}`)
                    .setDisabled(true)
                    .setStyle('SECONDARY');

                const row1 = new MessageActionRow().addComponents([but2, but3, but1]);

                const embed4 = new MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(pages[page])

                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL({
                            dynamic: true
                        }),
                    })
                    .setAuthor({
                        name: `${client.user.username}'s Bot`,
                        iconURL: client.user.avatarURL({
                            dynamic: true
                        })
                    })
                    .setTimestamp()
                    .setTitle(`Total Servers: ${client.guilds.cache.size} | Total Users: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} | Page: ${page + 1}/${pages.length}`);

                await msg.edit({
                        embeds: [embed4],
                        components: [row1],
                    })
                    .catch(() => {});
            } else if (button.customId === 'queue_cmd_but_3') {
                await button.deferUpdate().catch(() => {});
                collector.stop();
            } else return;
        });

        collector.on('end', async () => {
            const but4 = new MessageButton()
                .setCustomId('queue_cmd_but_1')
                .setLabel('NEXT')
                .setDisabled(true)
                .setStyle('SUCCESS');

            const but5 = new MessageButton()
                .setCustomId('queue_cmd_but_2')
                .setLabel('PREVIOUS')
                .setDisabled(true)
                .setStyle('SUCCESS');

            const but6 = new MessageButton()
                .setCustomId('queue_cmd_but_3')
                .setLabel(`${page + 1}/${pages.length}`)
                .setDisabled(true)
                .setStyle('SECONDARY');

            const row2 = new MessageActionRow().addComponents([but5, but6, but4]);
            await msg.edit({
                components: [row2],
            });
        });
    }
}