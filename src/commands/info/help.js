const {
	SlashCommandBuilder
} = require('@discordjs/builders');

const {
	MessageEmbed
} = require("discord.js");

const fs = require("fs");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display all commands'),
	async execute(interaction) {
		const roleColor =
			interaction.guild.me.displayHexColor === "#000000" ?
			"#ffffff" :
			interaction.guild.me.displayHexColor;

		let categories = [];

		fs.readdirSync(`../../src/commands/`).forEach((dir) => {
			const commands = fs.readdirSync(`../../commands/${dir}/`).filter((file) => file.endsWith(".js"));

			const cmds = commands.map((command) => {
				let file = require(`../../commands/${dir}/${command}`);

				if (!file.name) return "No command name.";

				let name = file.name.replace(".js", "");

				return `\`${name}\``;
			});

			let data = new Object();

			data = {
				name: dir.toUpperCase(),
				value: cmds.length === 0 ? "In progress." : cmds.join(" "),
			};

			categories.push(data);
		});

		const embed = new MessageEmbed()
			.setTitle("📬 Need help? Here are all of my commands:")
			.addFields(categories)
			.setDescription(
				`Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ban\`.`
			)
			.setFooter(
				`Requested by ${interaction.author.tag}`,
				interaction.author.displayAvatarURL({
					dynamic: true
				})
			)
			.setTimestamp()
			.setColor(roleColor);
		return interaction.channel.send(embed);
	}
}