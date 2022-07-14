const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all commands'),
    async execute(interaction) {
        const Embed = new MessageEmbed()
		.setAuthor("Luma", "https://media.discordapp.net/attachments/895632161057669180/964145767340204042/purchase_premium.png")
		.setDescription(`Hey! Thank you for adding me into your awesome server, my name is [**Luma**](https://discord.com/oauth2/authorize?client_id=991389222323892374&permissions=8&scope=bot%20applications.commands)! I am a modern, multi purpose solution for Discord.

		If you ever encounter any problems/bugs while using me, please be sure to report them at our [**support server**](https://discord.gg/3eXAf3mUT3).
		
		If you ever wish to purchase our premium subscription to have access to exclusive channels & commands, once again please join our [**support server**](https://discord.gg/3eXAf3mUT3) and discuss in a ticket!
		**─────────────────────────────────────**
		[**SUPPORT DISCORD | CLICK HERE**](https://discord.gg/3eXAf3mUT3)
		[**INVITE BOT | CLICK HERE**](https://discord.com/oauth2/authorize?client_id=991389222323892374&permissions=8&scope=bot%20applications.commands)
		**─────────────────────────────────────**
		`)

		.addField(`**Ticket System**`, `\`\`\`setchannel, settranscripts, setbuttons, setcategory, setdefaultrole, setstaffrole, setdescription, panel\`\`\``)
		.addField(`**Music System**`, `\`\`\`play, volume, filter, repeat, skip, queue, pause, resume, previous, nowplaying, stop, search\`\`\``)
		.addField(`**Moderation System**`, `\`\`\`ban, kick, purge, slowmode, lock, unlock, timeout\`\`\``)
		.addField(`**Giveaway System**`, `\`\`\`start, end, pause, unpause, reroll, delete\`\`\``)
		.addField(`**Verification System**`, `\`\`\`panel, setrole, settings\`\`\``)
		.addField(`**Information**`, `\`\`\`info, status, ping, help\`\`\``)
		.addField(`**Event System**`, `\`\`\`gtn\`\`\``)


		.setColor(`#2f3136`)
		.setImage('https://media.discordapp.net/attachments/895632161057669180/938422114418061353/void_purple_bar.PNG');

		await interaction.reply(
			{ 
				embeds: [Embed] 
			}
		);
    }
}