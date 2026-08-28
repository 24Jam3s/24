// commands/leaderboard.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the global tournament leaderboard.'),

  async execute(interaction) {
    const stats = interaction.client.playerStats;

    if (!stats || Object.keys(stats).length === 0) {
      return interaction.reply({
        content: 'No player stats available yet.',
        ephemeral: true
      });
    }

    // Convert stats object into sortable array
    const players = Object.entries(stats).map(([userId, data]) => ({
      userId,
      wins: data.wins || 0,
      losses: data.losses || 0,
      tournamentWins: data.tournamentWins || 0
    }));

    // Sort by:
    // 1. Most Wins
    // 2. Most Tournament Wins
    // 3. Fewest Losses
    players.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.tournamentWins !== a.tournamentWins) return b.tournamentWins - a.tournamentWins;
      return a.losses - b.losses;
    });

    // Build leaderboard lines
    const lines = players.map((p, index) => {
      return `- ${index + 1}st: <@${p.userId}> Wins: \`\`${p.wins}\`\` | Losses: \`\`${p.losses}\`\` | Tournament Wins: \`\`${p.tournamentWins}\`\``;
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Leaderboard 🏆`,
        ``,
        `**\`\`Tournament Participants\`\`**`,
        ...lines
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
