// commands/tournamentleaderboard.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentleaderboard')
    .setDescription('View the tournament leaderboard.'),

  async execute(interaction) {

    const stats = interaction.client.playerStats;

    if (!stats || Object.keys(stats).length === 0) {
      return interaction.reply({
        content: 'No player stats available yet.',
        ephemeral: true
      });
    }

    // Convert stats object → array
    const players = Object.entries(stats).map(([userId, data]) => ({
      userId,
      wins: data.wins || 0,
      losses: data.losses || 0,
      tournamentWins: data.tournamentWins || 0
    }));

    // Sort leaderboard
    players.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.tournamentWins !== a.tournamentWins) return b.tournamentWins - a.tournamentWins;
      return a.losses - b.losses;
    });

    // Build leaderboard lines
    const lines = players.map((p, index) => {
      const place =
        index === 0 ? '🥇' :
        index === 1 ? '🥈' :
        index === 2 ? '🥉' :
        `${index + 1}.`;

      return `${place} <@${p.userId}> — Wins: \`${p.wins}\` | Losses: \`${p.losses}\` | Tournament Wins: \`${p.tournamentWins}\``;
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Leaderboard 🏆`,
        ``,
        `**Top Players:**`,
        ...lines
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
