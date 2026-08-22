import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('endleague')
    .setDescription('End the current league.'),

  async execute(interaction) {
    interaction.client.league = null;

    return interaction.reply({ content: 'League has been ended.' });
  }
};
