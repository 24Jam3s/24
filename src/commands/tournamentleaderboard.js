// commands/tournamentleaderboard.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentleaderboard")
    .setDescription("Show the global tournament leaderboard."),

  async execute(interaction) {
    const stats = interaction.client.playerStats || {};

    if (Object.keys(stats).length === 0) {
      return interaction.reply({
        content: "No player stats recorded yet.",
        ephemeral: true,
      });
    }

    const sorted = Object.entries(stats)
      .sort((a, b) => {
        const A = a[1];
        const B = b[1];
        return (
          B.wins - A.wins ||
          B.tournamentWins - A.tournamentWins ||
          A.losses - B.losses
        );
      });

    const lines = sorted.map(([id, s]) => {
      return `<@${id}> \`\`${s.wins}\`\` | \`\`${s.losses}\`\` | \`\`${s.tournamentWins}\`\``;
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Leaderboard`,
        ``,
        ...lines,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
