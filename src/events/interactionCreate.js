const {
    MessageAttachment,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    WebhookClient,
    GuildMember
} = require("discord.js");
const {
    Captcha
} = require("captcha-canvas");

const {
    default: mongoose
} = require("mongoose");

const Guild = require(`../database/models/guildSchema`)
const TicketSetup = require(`../database/models/ticketSetupSchema`)


module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            let guildProfile = await Guild.findOne({
                guildID: interaction.guild.id
            });

            if (!guildProfile) {
                guildProfile = await new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: interaction.guild.id,
                    guildName: interaction.guild.name
                });
                await guildProfile.save().catch(err => console.log(err));
            }

            //
            let ticketProfile = await TicketSetup.findOne({
                guildID: interaction.guild.id
            });

            if (!ticketProfile) {
                ticketProfile = await new TicketSetup({
                    _id: mongoose.Types.ObjectId(),
                    GuildID: interaction.guild.id,
                });
                await ticketProfile.save().catch(err => console.log(err));
            }

            try {
                if (command.permissions && command.permissions.length > 0) {
                    const Embed = new MessageEmbed()
                        .setAuthor("Insufficient Permissions", "https://media.discordapp.net/attachments/981264899034476644/995440858923008020/image_10.png")
                        .setDescription("You lack permissions to preform this command.")
                        .setImage("https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG")
                        .setColor(`#2f3136`);

                    if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({
                        embeds: [Embed],
                        ephemeral: true
                    });
                }

                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        } else if (interaction.isButton()) {
            const captcha = new Captcha();
            captcha.async = true;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();

            const captchaAttachment = new MessageAttachment(await captcha.png, "captcha.png");
            const captchaEmbed = new MessageEmbed()
                .setAuthor('Verification', 'https://media.discordapp.net/attachments/895632161057669180/964145767340204042/purchase_premium.png')
                .setDescription(`To verify yourself, click the correct code that it's displaying in green.`)
                .setImage('attachment://captcha.png')
                .setColor(`#2f3136`);

            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`verify-${getRandomString(6)}-invalidcaptcha`)
                    .setLabel(getRandomString(6))
                    .setStyle("PRIMARY"),

                    new MessageButton()
                    .setCustomId(`verify-${getRandomString(6)}-invalidcaptcha`)
                    .setLabel(getRandomString(6))
                    .setStyle("PRIMARY"),

                    new MessageButton()
                    .setCustomId(`verify-${captcha.text}-correctcaptcha`)
                    .setLabel(`${captcha.text}`)
                    .setStyle("PRIMARY")
                );

            if (interaction.customId.includes("verify")) {
                if (interaction.customId.includes("invalidcaptcha")) {
                    const responseEmbed = new MessageEmbed()
                        .setTitle("Wrong captcha!")
                        .setDescription(`Try again!`)
                        .setColor(`#2f3136`);


                    const msg = await interaction.reply({
                        embeds: [responseEmbed],
                        ephemeral: true,
                    });
                    return true;
                }

                if (interaction.customId.includes("correctcaptcha")) {
                    const responseEmbed = new MessageEmbed()
                        .setAuthor('Success', 'https://media.discordapp.net/attachments/994998007139414086/995443786018717747/image_6.png')
                        .setDescription(`You've successfully verified yourself a human!`)
                        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                        .setColor(`#2f3136`);

                    try {
                        let guildProfile = await Guild.findOne({
                            guildID: interaction.guild.id
                        });

                        if (!guildProfile) {
                            guildProfile = await new Guild({
                                _id: mongoose.Types.ObjectId(),
                                guildID: interaction.guild.id,
                                guildName: interaction.guild.name
                            });
                            await guildProfile.save().catch(err => console.log(err));
                        }

                        var guild = client.guilds.cache.get(guildProfile.guildID)
                        const member = await guild.members.fetch(interaction.user.id)
                        const role = await guild.roles.fetch(guildProfile.verificationRoleID);
                        member.roles.add(role)

                        const msg = await interaction.reply({
                            embeds: [responseEmbed],
                            ephemeral: true,
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }

                if (interaction.customId.includes("send")) {
                    const msg = await interaction.reply({
                        files: [captchaAttachment],
                        embeds: [captchaEmbed],
                        components: [buttons],
                        ephemeral: true,
                    });
                }
            }
        }

        function getRandomString(length) {
            var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var result = '';
            for (var i = 0; i < length; i++) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }
            return result;
        }
    }
};