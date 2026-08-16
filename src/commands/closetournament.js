import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('closetournament')
    .setDescription('Close and delete the current tournament.'),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    interaction.client.tournament = null;

    return interaction.reply({
      content: 'Tournament closed.',
      ephemeral: true
    });
  }
};
