// commands/playerstats.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('playerstats')
    .setDescription('View player tournament stats.')
    .addUserOption(o =>
      o.setName('player')
        .setDescription('Player to view stats for')
        .setRequired(false)
    ),

  async execute(interaction) {

    // Ensure stats object exists
    if (!interaction.client.playerStats) {
      interaction.client.playerStats = {};
    }

    // If no player selected → show stats for yourself
    const target = interaction.options.getUser('player') || interaction.user;
    const id = target.id;

    // Create empty stats if none exist
    if (!interaction.client.playerStats[id]) {
      interaction.client.playerStats[id] = {
        wins: 0,
        losses: 0,
        tournamentWins: 0
      };
    }

    const stats = interaction.client.playerStats[id];

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Player Stats 🏆`,
        ``,
        `**Player:** <@${id}>`,
        ``,
        `**Wins:** \`${stats.wins}\``,
        `**Losses:** \`${stats.losses}\``,
        `**Tournament Wins:** \`${stats.tournamentWins}\``,
        ``,
        `Stats are tracked across all tournaments.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
