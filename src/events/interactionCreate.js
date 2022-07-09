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

const Guild = require(`../database/models/guildSchema`)

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                if(command.permissions && command.permissions.length > 0) {
                    const Embed = new MessageEmbed()
                        .setTitle("Insufficient permissions.")
                        .setColor(`#2f3136`);

                    if(!interaction.member.permissions.has(command.permissions)) return await interaction.reply({
                        embeds: [Embed]
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
                .setTitle('Luma Verification')
                .setDescription('Please complete the captcha by clicking the correct button.')
                .setImage('attachment://captcha.png')

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
                        .setTitle("You've succeeded the captcha!")
                        .setDescription(`You've been given the Verified Role!`)
                        .setColor(`#2f3136`);

                        let guildProfile = await Guild.findOne({
                            guildID: interaction.guild.id
                        });

                        var guild = client.guilds.cache.get(guildProfile.guildID)
                        const member = await guild.members.fetch(interaction.user.id)
                        const role = await guild.roles.fetch(guildProfile.verificationRoleID);
                        member.roles.add(role)

                    const msg = await interaction.reply({
                        embeds: [responseEmbed],
                        ephemeral: true,
                    });

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