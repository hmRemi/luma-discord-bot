const { SlashCommandBuilder } = require('@discordjs/builders');
const { hypixel, errors } = require('../../utils/hypixel');
const commaNumber = require('comma-number');;
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hypixel')
        .setDescription('Display hypixel stats')
        .addSubcommand(subcommand =>
            subcommand
            .setName("options")
            .setDescription("List all music settings")
            .addStringOption((option) =>
                option
                .setName('options')
                .setDescription('Select an option.')
                .setRequired(true)
                .addChoices(
                    {
                        name: "profile",
                        value: "profile"
                    }, 
                    {
                        name: "skywars",
                        value: "skywars"
                    }, 
                    {
                        name: "bedwars",
                        value: "bedwars"
                    }, 
                ),
            )
            .addStringOption(option => option.setName('user').setDescription('Username of player').setRequired(true))
        ),
    async execute(interaction) {
        const player = interaction.options.getString('user');

        switch (interaction.options.getString("options")) {
            case "profile":
                hypixel.getPlayer(player, { guild: true }).then(async (player) => {
                    if (!player.isOnline) {
                        playerIsOnline = "Offline"
                    } else if (player.isOnline) {
                        playerIsOnline = "Online"
                    }
        
                    if (player.mcVersion == null) {
                        playerMinecraftVersion = "Unknown";
                    } else if (player.mcVersion != null) {
                        playerMinecraftVersion = player.mcVersion;
                    }
        
                    if (player.rank == 'Default') {
                        playerRank = "None";
                    } else if (player.rank != 'Default') {
                        playerRank = player.rank;
                    }
        
                    const embed = new MessageEmbed()
                        .setAuthor({
                            name: `Hypixel Manager`,
                            iconURL: 'https://i.imgur.com/tRe29vU.jpeg',
                            url: 'https://discord.gg/ma6TcSambz'
                        })
                        .setTitle(`[${player.rank}] ${player.nickname}`)
                        .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                        .addField('Rank', `\`${playerRank}\``, true)
                        .addField('Level', `\`${player.level}\``, true)
                        .addField('Karma', `\`${commaNumber(player.karma)}\``, true)
                        .setColor(`#2f3136`)
                        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
        
                    if (player.guild !== null && player.guild.tag == null) {
                        embed.addField('Guild', `\`${player.guild.name}\``)
                    }
        
                    if (player.guild !== null && player.guild.tag !== null) {
                        embed.setTitle(`[${player.rank}] ${player.nickname} [${player.guild.tag}]`)
                        embed.addField('Guild', `\`${player.guild.name} [${player.guild.tag}]\``)
                    }
                    
                    embed.addField('Main MC Version', `\`${playerMinecraftVersion}\``, true)
                    embed.addField('First Login', `<t:${Math.ceil(player.firstLoginTimestamp / 1000)}:R>`)
                    embed.addField('Last Login', `<t:${Math.ceil(player.lastLoginTimestamp / 1000)}:R>`)
                    embed.addField('Status', `\`${playerIsOnline}\``, true)
        
                    if (player.rank.includes('MVP+')) {
                        if (player.plusColor == null) {
                            embed.addField('Plus Color', '`Red`')
                        } else {
                            embed.addField('Plus Color', `\`${player.plusColor}\``)
                        }
                    }
        
                    interaction.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
                }).catch(e => { // error messages
                    if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                        const player404 = new MessageEmbed()
                            .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                            .setDescription('I could not find that player in the API. Check spelling and name history.')
                            .setColor(`#2f3136`)
                            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                        interaction.channel.send({ embeds: [player404], allowedMentions: { repliedUser: false } })
                    } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                        const neverLogged = new MessageEmbed()
                            .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                            .setDescription('That player has never logged into Hypixel.')
                            .setColor(`#2f3136`)
                            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                        interaction.channel.send({ embeds: [neverLogged], allowedMentions: { repliedUser: false } })
                    } else {
                        if (args[0]) {
                            const error = MessageEmbed()
                                .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                                .setDescription('An error has occurred. If the error persists, please make a support ticket in the server. `h!links`')
                                .setColor(`#2f3136`)
                                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                            interaction.channel.send({ embeds: [error], allowedMentions: { repliedUser: false } })
                        }
                    }     
                });
                break;
            case "skywars":
                hypixel.getPlayer(player, { guild: true }).then(async (player) => {
                    const embed = new MessageEmbed()
                    .setAuthor('SkyWars Stats', 'https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addField('Level', `\`${player.stats.skywars.level}\``, true)
                    .addField('Heads', `\`${commaNumber(player.stats.skywars.heads)}\``, true)
                    .addField('KD Ratio', `\`${player.stats.skywars.KDRatio}\``, true)
                    .addField('WL Ratio', `\`${player.stats.skywars.WLRatio}\``, true)
                    .addField('Coins', `\`${commaNumber(player.stats.skywars.coins)}\``, true)
                    .addField('Total Deaths', `\`${commaNumber(player.stats.skywars.deaths)}\``, true)
                    .addField('Total Kills', `\`${commaNumber(player.stats.skywars.kills)}\``, true)
                    .addField('Winstreak', `\`${commaNumber(player.stats.skywars.winstreak)}\``, true)
                    .addField('Total Wins', `\`${commaNumber(player.stats.skywars.wins)}\``, true)
                    .addField('Tokens', `\`${commaNumber(player.stats.skywars.tokens)}\``, true)
                    .addField('Prestige', `\`${player.stats.skywars.prestige}\``, true)
                    .addField('Souls', `\`${commaNumber(player.stats.skywars.souls)}\``, true)
                    .addField('Ranked Kills', `\`${commaNumber(player.stats.skywars.ranked.kills)}\``, true)
                    .addField('Ranked Losses', `\`${commaNumber(player.stats.skywars.ranked.losses)}\``, true)
                    .addField('Ranked Games Played', `\`${commaNumber(player.stats.skywars.ranked.played)}\``, true)
                    .addField('Ranked Wins', `\`${commaNumber(player.stats.skywars.ranked.wins)}\``, true)
                    .addField('Ranked KD Ratio', `\`${player.stats.skywars.ranked.KDRatio}\``, true)
                    .addField('Ranked WL Ratio', `\`${player.stats.skywars.ranked.WLRatio}\``, true)
                    .setColor(`#2f3136`)
                    .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

                    interaction.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } });
                }).catch(e => { // error messages
                    if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                        const player404 = new MessageEmbed()
                            .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                            .setDescription('I could not find that player in the API. Check spelling and name history.')
                            .setColor(`#2f3136`)
                            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                        interaction.channel.send({ embeds: [player404], allowedMentions: { repliedUser: false } })
                    } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                        const neverLogged = new MessageEmbed()
                            .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                            .setDescription('That player has never logged into Hypixel.')
                            .setColor(`#2f3136`)
                            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                        interaction.channel.send({ embeds: [neverLogged], allowedMentions: { repliedUser: false } })
                    } else {
                        if (args[0]) {
                            const error = MessageEmbed()
                                .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                                .setDescription('An error has occurred. If the error persists, please make a support ticket in the server. `h!links`')
                                .setColor(`#2f3136`)
                                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                            interaction.channel.send({ embeds: [error], allowedMentions: { repliedUser: false } })
                        }
                    }       
                });
                break;
            case "bedwars":
                hypixel.getPlayer(player, { guild: true }).then(async (player) => {
                    const embed = new MessageEmbed()
                    .setAuthor('BedWars Stats', 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BedWars-64.png')
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addField('Level', `\`${player.stats.bedwars.level}✫\``, true)
                    .addField('Coins', `\`${commaNumber(player.stats.bedwars.coins)}\``, true)
                    .addField('Winstreak', `\`${commaNumber(player.stats.bedwars.winstreak)}\``, true)
                    .addField('Wins', `\`${commaNumber(player.stats.bedwars.wins)}\``, true)
                    .addField('Losses', `\`${commaNumber(player.stats.bedwars.losses)}\``, true)
                    .addField('WLR', `\`${player.stats.bedwars.WLRatio}\``, true)
                    .addField('Kills', `\`${commaNumber(player.stats.bedwars.kills)}\``, true)
                    .addField('Deaths', `\`${commaNumber(player.stats.bedwars.deaths)}\``, true)
                    .addField('KDR', `\`${player.stats.bedwars.KDRatio}\``, true)
                    .addField('Final Kills', `\`${commaNumber(player.stats.bedwars.finalKills)}\``, true)
                    .addField('Final Deaths', `\`${commaNumber(player.stats.bedwars.finalDeaths)}\``, true)
                    .addField('FKDR', `\`${player.stats.bedwars.finalKDRatio}\``, true)
                    .addField('Beds Broken', `\`${commaNumber(player.stats.bedwars.beds.broken)}\``, true)
                    .addField('Beds Lost', `\`${commaNumber(player.stats.bedwars.beds.lost)}\``, true)
                    .addField('BBLR', `\`${player.stats.bedwars.beds.BLRatio}\``, true)
                    .addField('Total Iron', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.iron)}\``, true)
                    .addField('Total Gold', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.gold)}\``, true)
                    .addField('Total Diamonds', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.diamond)}\``, true)
                    .addField('Total Emeralds', `\`${commaNumber(player.stats.bedwars.collectedItemsTotal.emerald)}\``, true)
                    .addField('Finals/Game', `\`${commaNumber(player.stats.bedwars.avg.finalKills)}\``, true)
                    .addField('Beds/Game', `\`${commaNumber(player.stats.bedwars.avg.bedsBroken)}\``, true)
                    .addField(`Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR`, `\`${commaNumber((player.stats.bedwars.losses*Math.ceil(player.stats.bedwars.WLRatio))-player.stats.bedwars.wins)}\``, true)
                    .addField(`Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR`, `\`${commaNumber((player.stats.bedwars.finalDeaths*Math.ceil(player.stats.bedwars.finalKDRatio))-player.stats.bedwars.finalKills)}\``, true)
                    .addField(`Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR`, `\`${commaNumber((player.stats.bedwars.beds.lost*Math.ceil(player.stats.bedwars.beds.BLRatio))-player.stats.bedwars.beds.broken)}\``, true)
                    .setColor(`#2f3136`)
                    .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')

                    interaction.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } });
                }).catch(e => { // error messages
                    if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                        const player404 = new MessageEmbed()
                            .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                            .setDescription('I could not find that player in the API. Check spelling and name history.')
                            .setColor(`#2f3136`)
                            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                        interaction.channel.send({ embeds: [player404], allowedMentions: { repliedUser: false } })
                    } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                        const neverLogged = new MessageEmbed()
                            .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                            .setDescription('That player has never logged into Hypixel.')
                            .setColor(`#2f3136`)
                            .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                        interaction.channel.send({ embeds: [neverLogged], allowedMentions: { repliedUser: false } })
                    } else {
                        if (args[0]) {
                            const error = MessageEmbed()
                                .setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
                                .setDescription('An error has occurred. If the error persists, please make a support ticket in the server. `h!links`')
                                .setColor(`#2f3136`)
                                .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG')
                            interaction.channel.send({ embeds: [error], allowedMentions: { repliedUser: false } })
                        }
                    }       
                });
        }
    }
}