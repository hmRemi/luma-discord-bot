const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all commands'),
    async execute(interaction) {
        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('help-category')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Information',
							description: 'Shows all info commands',
							value: 'info-category',
						},
						{
							label: 'Settings',
							description: 'Shows all settings for the bot.',
							value: 'settings-category',
						},
					]),
			);

		await interaction.reply({ content: '', components: [row] });
    }
}