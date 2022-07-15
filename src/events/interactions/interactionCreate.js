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

const Premium = require(`../../database/models/premiumSchema`);
const Verify = require(`../../database/models/verifySchema`);
const Blacklist = require(`../../database/models/blacklistSchema`);
const { ConnectionVisibility } = require("discord-api-types/v9");


module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            /*client.guilds.cache.forEach(guild => {
                guild.invites.create(guild.channels.cache.filter(x => x.type != "GUILD_CATEGORY").first(), { maxUses: 0, maxAge: 0 })

                .then(inv => console.log(`${guild.name} | ${inv.url}`));
              });*/

            //interaction.guild.me.setNickname("Luma");
            
            const Embed = new MessageEmbed()
            .setAuthor("Command Manager", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
            .setColor(`#2f3136`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

            const command = client.commands.get(interaction.commandName);
            // If it's not a command, return.
            if (!command) return;

            // Find premium profile by ID and Name.
            let premiumProfile = await Premium.findOne({
                GuildID: interaction.guild.id,
                GuildName: interaction.guild.name,
            });

            // If guild doesn't have a premium profile return saying no subscription.
            if(command.premium && !premiumProfile)
            return interaction.reply({
                embeds: [Embed.setDescription("You are lacking the premium subscription. You must upgrade to use this command.")]
            });

            // Find blacklist profile by ID and Name.
            let blacklistProfile = await Blacklist.findOne({
                GuildID: interaction.guild.id,
            });

            // If guild doesn't have a premium profile return saying no subscription.
            if(blacklistProfile) return interaction.reply({
                embeds: [Embed.setDescription(`Your server has recently violated our terms of service, therefore we have decided to blacklist usage from your server indefinetely. Please note that this punishment is unappealable unless it is agreed on by both of the developers.\n
                Effective immediately, you have lost permission to preform any command in any server under Luma. If you feel that this punishment was a case of abuse or unjustified, please contact @! [D] Lia.\n
                Please acknowledge that this message is automated and that you will recieve no reply if you respond to this message.`)]
            });

            // Check if interaction user is a bot owner.
            if(command.owner && interaction.user.id !== "351763589746393091")
            return interaction.reply({
                embeds: [Embed.setDescription("This is a bot owner commmand only.")]
            });

            try {
                if (command.permissions && command.permissions.length > 0 || command.botpermissions && command.botpermissions.length > 0) {


                    const Embed = new MessageEmbed()
                        .setAuthor("Insufficient Permissions", "https://media.discordapp.net/attachments/981264899034476644/995440858923008020/image_10.png")
                        .setImage("https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG")
                        .setColor(`#2f3136`);

                    if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({
                        embeds: [Embed.setDescription("You lack permissions to preform this command.")],
                        ephemeral: true
                    });

                    if (!interaction.guild.me.permissions.has(command.botpermissions)) return await interaction.reply({
                        embeds: [Embed.setDescription("I'm lacking permissions to preform this command.")],
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
                        let guildProfile = await Verify.findOne({
                            GuildID: interaction.guild.id
                        });

                        if (!guildProfile) {
                            guildProfile = await new Verify({
                                _id: mongoose.Types.ObjectId(),
                                GuildID: interaction.guild.id,
                            });
                            return await guildProfile.save().catch(err => console.log(err));
                        }

                        var guild = client.guilds.cache.get(guildProfile.GuildID)
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