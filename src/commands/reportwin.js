import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('reportwin')
    .setDescription('Report the winner of a match.')
    .addIntegerOption(o =>
      o.setName('match')
        .setDescription('Match number')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('winner')
        .setDescription('Winning team name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament || !tournament.started) {
      return interaction.reply({
        content: 'Tournament has not started yet.',
        ephemeral: true
      });
    }

    const match = interaction.options.getInteger('match');
    const winner = interaction.options.getString('winner');

    return interaction.reply({
      content: `🏆 **Match ${match} Winner:** ${winner}`,
      ephemeral: false
    });
  }
};
