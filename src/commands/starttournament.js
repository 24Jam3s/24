import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('starttournament')
    .setDescription('Start the tournament and lock team entries.'),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    if (tournament.started) {
      return interaction.reply({
        content: 'The tournament has already started.',
        ephemeral: true
      });
    }

    tournament.started = true;

    return interaction.reply({
      content: 'Tournament started.',
      ephemeral: true
    });
  }
};
