import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('endleague')
    .setDescription('End the current league.'),

  async execute(interaction) {
    const league = interaction.client.league;

    if (league?.thread) {
      await league.thread.setArchived(true);
    }

    interaction.client.league = null;

    return interaction.reply({ content: 'League has been ended.' });
  }
};
