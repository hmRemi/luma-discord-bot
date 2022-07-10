const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    ChannelType
} = require("discord-api-types/v9");

const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");

const DB = require(`../../database/models/ticketSchema`)
const DBSetup = require(`../../database/models/ticketSetupSchema`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('List all ticket commands')
        .addSubcommand((subcommand) =>
            subcommand
            .setName('adduser')
            .setDescription('Displays information regarding the specified user')
            .addUserOption((option) =>
                option
                .setName('target')
                .setDescription('The user')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName('removeuser')
            .setDescription('Displays information regarding the specified guild member')
            .addUserOption((option) =>
                option
                .setName('target')
                .setDescription('The member')
                .setRequired(true),
            ),
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("setcategory")
            .setDescription("List all verification settings")
            .addChannelOption((option) =>
                option
                .setName('category')
                .setDescription('Set category for tickets')
                .setRequired(true) // This option is required
                .addChannelTypes(ChannelType.GuildCategory)

            ))

        .addSubcommand(subcommand =>
            subcommand
            .setName("setchannel")
            .setDescription("Select the ticket creation channel")
            .addChannelOption((option) =>
                option
                .setName('channel')
                .setDescription('Select the ticket creation channel')
                .setRequired(true) // This option is required
                .addChannelTypes(ChannelType.GuildText)

            ))

        .addSubcommand(subcommand =>
            subcommand
            .setName("settranscripts")
            .setDescription("Select the ticket transcripts creation channel")
            .addChannelOption((option) =>
                option
                .setName('transcripts')
                .setDescription('Select the ticket transcripts creation channel')
                .setRequired(true) // This option is required
                .addChannelTypes(ChannelType.GuildText)

            ))

        .addSubcommand(subcommand =>
            subcommand
            .setName("setstaffrole")
            .setDescription("Select the staff role")
            .addRoleOption((option) =>
                option
                .setName('staffrole')
                .setDescription('Select the staff role')
                .setRequired(true) // This option is required

            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName("setdefaultrole")
            .setDescription("Select the @everyone/member role")
            .addRoleOption((option) =>
                option
                .setName('defaultrole')
                .setDescription('Select the @everyone/member role')
                .setRequired(true) // This option is required

            ))

        .addSubcommand(subcommand =>
            subcommand
            .setName("setdescription")
            .setDescription("Set the description of the ticket creation channel.")
            .addStringOption((option) =>
                option
                .setName('description')
                .setDescription('Set the description of the ticket creation channel.')
                .setRequired(true) // This option is required

            ))

        .addSubcommand(subcommand =>
            subcommand
            .setName("setbuttons")
            .setDescription("Customize buttons")
            .addStringOption((option) =>
                option
                .setName('button1')
                .setDescription('Customize button 1')
                .setRequired(true) // This option is required
            )
            .addStringOption((option) =>
                option
                .setName('button2')
                .setDescription('Customize button 2')
                .setRequired(true) // This option is required
            )
            .addStringOption((option) =>
                option
                .setName('button3')
                .setDescription('Customize button 3')
                .setRequired(true) // This option is required
            ))
            

        .addSubcommand(subcommand =>
            subcommand
            .setName("panel")
            .setDescription("Send ticket panel")
            ),
    

    async execute(interaction) {
        const {
            guild,
            options,
            channel
        } = interaction;

        const Embed = new MessageEmbed();
        const ChannelSend = options.getChannel('channel');
        const Category = options.getChannel('category');
        const Transcripts = options.getChannel('transcripts');

        const Handlers = options.getRole('staffrole');
        const Everyone = options.getRole('defaultrole');

        const Description = options.getString('description');

        const Button1 = options.getString('button1');
        const Button2 = options.getString('button2');
        const Button3 = options.getString('button3');

        let profile = await DBSetup.findOne({
            GuildID: guild.id
        });

        if (interaction.options.getSubcommand() === "setbuttons") {
            try {
                await DBSetup.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Buttons: [Button1, Button2, Button3],
                }, {
                    new: true,
                    upsert: true,
                });

                await interaction.reply('Updated buttons')
            } catch (err) {
                console.log(err);
            }
        }

        if (interaction.options.getSubcommand() === "setchannel") {
            try {
                await DBSetup.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Channel: ChannelSend.id,
                }, {
                    new: true,
                    upsert: true,
                });
                await interaction.reply('Updated channel')
            } catch (err) {
                console.log(err);
            }
        }

        if (interaction.options.getSubcommand() === "setdescription") {
            try {
                await DBSetup.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Description: Description,
                }, {
                    new: true,
                    upsert: true,
                });
                await interaction.reply('Updated description')
            } catch (err) {
                console.log(err);
            }
        }

        if (interaction.options.getSubcommand() === "settranscripts") {
            try {
                await DBSetup.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Transcripts: Transcripts.id,
                }, {
                    new: true,
                    upsert: true,
                });
                await interaction.reply('Updated transcripts')
            } catch (err) {
                console.log(err);
            }
        }

        if (interaction.options.getSubcommand() === "setdefaultrole") {
            try {
                await DBSetup.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Everyone: Everyone.id,
                }, {
                    new: true,
                    upsert: true,
                });
                await interaction.reply('Updated default role')
            } catch (err) {
                console.log(err);
            }
        }

        if (interaction.options.getSubcommand() === "setstaffrole") {
            try {
                await DBSetup.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Handlers: Handlers.id,
                }, {
                    new: true,
                    upsert: true,
                });
                await interaction.reply('Updated staff role')
            } catch (err) {
                console.log(err);
            }
        }

        if (interaction.options.getSubcommand() === "setcategory") {
            try {
                await DBSetup.findOneAndUpdate({
                    GuildID: guild.id
                }, {
                    Category: Category,
                }, {
                    new: true,
                    upsert: true,
                });
                await interaction.reply('Updated category')
            } catch (err) {
                console.log(err);
            }
        }

        if (options.getSubcommand() === "panel") {
            if(!profile.Description) return await interaction.reply("You must add a description");
            if(!profile.Buttons[0] || !profile.Buttons[1] || !profile.Buttons[2]) return await interaction.reply("You must add buttons");

            
            const Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                    .setCustomId(`${profile.Buttons[0]}`)
                    .setLabel(`${profile.Buttons[0]}`)
                    .setStyle('PRIMARY'),

                    new MessageButton()
                    .setCustomId(`${profile.Buttons[1]}`)
                    .setLabel(`${profile.Buttons[1]}`)
                    .setStyle('PRIMARY'),

                    new MessageButton()
                    .setCustomId(`${profile.Buttons[2]}`)
                    .setLabel(`${profile.Buttons[2]}`)
                    .setStyle('PRIMARY'),
                );

                const Embed = new MessageEmbed()
                .setAuthor(
                    guild.name + " | Ticketing System",
                    guild.iconURL({
                        dynamic: true
                    })
                )
                .setDescription(`${profile.Description}`)
                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                .setColor(`#2f3136`);

                if(!profile.Channel) return await interaction.reply("You must set a channel before sending the panel");

                await guild.channels.cache
                .get(profile.Channel)
                .send({embeds: [Embed], components: [Buttons]});
        }

        if (options.getSubcommand() === "adduser") {
            const addUser = options.getUser('target')

            DB.findOne({
                    GuildID: guild.id,
                    ChannelID: channel.id
                },
                async (err, docs) => {
                    if (err) throw err;
                    if (!docs) return interaction.reply({
                        embeds: [
                            Embed.setColor(`#2f3136`).setDescription(
                                "This channel is not tied with a ticket."
                            ),
                        ],
                        ephemeral: true,
                    });
                    if (docs.MembersID.includes(addUser.id))
                        return interaction.reply({
                            embeds: [
                                Embed.setColor(`#2f3136`).setDescription(
                                    "This member is already added to this ticket."
                                ),
                            ],
                            ephemeral: true
                        });
                    docs.MembersID.push(addUser.id);

                    channel.permissionOverwrites.edit(addUser.id, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    interaction.reply({
                        embeds: [
                            Embed.setColor(`#2f3136`).setDescription(
                                `${addUser} has been added to this ticket.`
                            ),
                        ],
                    });
                    docs.save();
                }
            )
        }
        if (interaction.options.getSubcommand() === "removeuser") {
            const removeUser = options.getUser('target')

            DB.findOne({
                    GuildID: guildId,
                    ChannelID: channel.id
                },
                async (err, docs) => {
                    if (err) throw err;
                    if (!docs)
                        return interaction.reply({
                            embeds: [
                                Embed.setColor(`#2f3136`).setDescription(
                                    "This channel is not tied with a ticket."
                                ),
                            ],
                            ephemeral: true,
                        });
                    if (!docs.MembersID.includes(removeUser.id))
                        return interaction.reply({
                            embeds: [
                                Embed.setColor(`#2f3136`).setDescription(
                                    "This member is not in this ticket."
                                ),
                            ],
                            ephemeral: true
                        });
                    docs.MembersID.remove(removeUser.id);

                    channel.permissionOverwrites.edit(removeUser.id, {
                        VIEW_CHANNEL: false,
                    });

                    interaction.reply({
                        embeds: [
                            Embed.setColor(`#2f3136`).setDescription(
                                `${removeUser} has been removed from this ticket.`
                            ),
                        ],
                    });
                    docs.save();
                }
            )
        }
    },
};