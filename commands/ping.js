const { SlashCommandBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
    const row = new ActionRowBuilder()
  .addComponents(
        new ButtonBuilder()
          .setCustomId('custombutton1')
          .setLabel('Primary')
          .setStyle(ButtonStyle.Primary),
      );

    return interaction.reply({ content: 'Pong!', components: [row] });
		// return interaction.reply('Pong!');
	}
};
