const {
    SlashCommandBuilder
} = require("@discordjs/builders");

const {
    CommandInteraction,
    Permissions,
    MessageEmbed
} = require("discord.js");

const Balance = require("../../database/models/balanceSchema");

const {
    default: mongoose
} = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Return balance of user")
        .addSubcommand(subcommand =>
            subcommand
            .setName("user")
            .setDescription("Gets the balance of user mentioned.")
            .addUserOption((option) => option.setName("target").setDescription("The user mentioned."))),
    async execute(interaction) {
        const {
            options,
            guild,
        } = interaction;

        const user = options.getUser("target") || interaction.user;

        const Embed = new MessageEmbed()
            .setAuthor("Economy System", "https://images-ext-1.discordapp.net/external/Py0I5pd-YigEQzWQXed_kxr8f0RHC6cTLBjY4ZaY1Hg/https/images-ext-2.discordapp.net/external/w4einSDWsGY1AHNyFOxJSs9pMnwTjPu8jWamK4BEWKg/%253Fsize%253D96%2526quality%253Dlossless/https/cdn.discordapp.com/emojis/995426830746140754.webp")
            .setColor(`#2f3136`)
            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

        let balanceProfile = await Balance.findOne({
            UserID: user.id
        });


        if(balanceProfile) {
            return await interaction.reply({
                embeds: [Embed
                    .setDescription(`Information found on ${user}'s balance.`)
                    .addField(`**Wallet**`, `\`\`\`${balanceProfile.Wallet} €\`\`\``)
                    .addField(`**Bank**`, `\`\`\`${balanceProfile.Bank} €\`\`\``)
                ]
            })
        }

        if (user !== interaction.user) return await interaction.reply({
            embeds: [Embed.setDescription(`${user} has no balance.`)]
        });
        balanceProfile = await new Balance({
            _id: mongoose.Types.ObjectId(),
            GuildID: guild.id,
            UserID: user.id,
            Wallet: 0,
            Bank: 0,
            lastDaily: new Date(),
            lastWeekly: new Date(),
            lastMonthly: new Date()
        });
        await balanceProfile.save().catch(err => console.log(err));
        await interaction.reply({
            embeds: [Embed.setDescription(`Creating profile for ${user}...\nUse this command again to check your balance.`)]
        });
        
    }
}