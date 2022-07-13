const client = require("../../index");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        const Embed = new MessageEmbed()
        .setAuthor("Introduction", "https://media.discordapp.net/attachments/895632161057669180/964145767340204042/purchase_premium.png")
        .setColor(`#2f3136`)
        .setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

        let owner = await guild.fetchOwner();

        await owner.send({
            embeds: [Embed.setDescription(`Hey! Thank you for adding me into your awesome server, my name is Luma! I am a modern, multi purpose solution for Discord.

            As of right now, we do not have a dashboard. Therefore, we have some commands and help to get you started! Firstly you would want to run the command "/help" for some basic information about me and what I can do, you will also find the command list in there.
            
            If you ever encounter any problems/bugs while using me, please be sure to report them at our support server.
            
            If you ever wish to purchase our premium subscription to have access to exclusive channels & commands, once again please join our support server and discuss in a ticket!`)]
        }).catch(err => console.log("The user who was banned did not receive the message due to DM's being toggled."));
    }
}