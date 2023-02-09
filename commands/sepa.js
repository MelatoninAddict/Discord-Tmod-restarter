const { SlashCommandBuilder } = require('discord.js');
console.log("testtestetest");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sepa')
		.setDescription('commands separated'),
	async execute(interaction) {
    console.log("testtestetest");
		await interaction.reply('command separated');
	}
};
