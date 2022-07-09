const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Replies with the bots status!'),
    async execute(interaction) {

        const online = true;
        const offline = false;
        const tinylag = false;
        const badconnection = false;

        const embedOnline = new MessageEmbed()
            .setAuthor({
                name: `Current Bot Status`,
                iconURL: 'https://images-ext-2.discordapp.net/external/z95N_F9zdjen-60DgOXHuCE50Yo_NhqFypNFurbp44U/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/995357710973415524.webp',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setThumbnail('https://cdn.discordapp.com/emojis/995317374683197510.webp?size=96&quality=lossless')
            .setDescription("**Luma Utilities** is currently up and running! If you detect or experience some issues, please contact us immediately!")
            .setColor(`#2f3136`)
            .setImage('https://cdn.discordapp.com/attachments/995312912820351037/995359473583530004/image_2.png')

        const embedOffline = new MessageEmbed()
            .setAuthor({
                name: `Current Bot Status`,
                iconURL: 'https://images-ext-2.discordapp.net/external/z95N_F9zdjen-60DgOXHuCE50Yo_NhqFypNFurbp44U/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/995357710973415524.webp',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setThumbnail('https://cdn.discordapp.com/emojis/995317370958655528.webp?size=96&quality=lossless')
            .setDescription(`**Luma Utilities** is down and offline. We're aware of this issue and are actively investigating the source of the problem to fix, please standby.`)
            .setColor(`#2f3136`)
            .setImage('https://cdn.discordapp.com/attachments/995312912820351037/995359473583530004/image_2.png')

        const embedBadConnection = new MessageEmbed()
            .setAuthor({
                name: `Current Bot Status`,
                iconURL: 'https://images-ext-2.discordapp.net/external/z95N_F9zdjen-60DgOXHuCE50Yo_NhqFypNFurbp44U/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/995357710973415524.webp',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setThumbnail('https://cdn.discordapp.com/emojis/995317372166602782.webp?size=96&quality=lossless')
            .setDescription(`**Luma Utilities** is currently up and running, however; you will be experiencing major lag while using the bot. We're aware of this issue and are actively investigating the source of the problem to fix, please standby.`)
            .setColor(`#2f3136`)
            .setImage('https://cdn.discordapp.com/attachments/995312912820351037/995359473583530004/image_2.png')

        const embedTinyLag = new MessageEmbed()
            .setAuthor({
                name: `Current Bot Status`,
                iconURL: 'https://images-ext-2.discordapp.net/external/z95N_F9zdjen-60DgOXHuCE50Yo_NhqFypNFurbp44U/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/995357710973415524.webp',
                url: 'https://discord.gg/ma6TcSambz'
            })
            .setThumbnail('https://cdn.discordapp.com/emojis/995317373311655986.webp?size=96&quality=lossless')
            .setDescription(`**Luma Utilities** is currently up and running, however you may be experiencing some lag while using the bot.We're aware of this issue and are actively investigating the source of the problem to fix, please standby.`)
            .setColor(`#2f3136`)
            .setImage('https://cdn.discordapp.com/attachments/995312912820351037/995359473583530004/image_2.png')

        if (online && !offline && !badconnection && !tinylag) {
            interaction.channel.send({
                embeds: [embedOnline],
                ephemeral: false
            });
        }

        if (offline && !online && !badconnection && !tinylag) {
            interaction.channel.send({
                embeds: [embedOffline],
                ephemeral: false
            });
        }

        if (tinylag && !offline && !online && !badconnection) {
            interaction.channel.send({
                embeds: [embedTinyLag],
                ephemeral: false
            });
        }

        if (badconnection && !offline && !online && !tinylag) {
            interaction.channel.send({
                embeds: [embedBadConnection],
                ephemeral: false
            });
        }
    }
}