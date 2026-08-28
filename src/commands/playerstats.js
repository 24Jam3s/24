// commands/playerstats.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('playerstats')
    .setDescription('View your global tournament stats.')
    .addUserOption(o =>
      o.setName('player')
        .setDescription('Player to view stats for')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('player') || interaction.user;
    const stats = interaction.client.playerStats?.[target.id];

    if (!stats) {
      return interaction.reply({
        content: `${target.username} has no recorded stats yet.`,
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Player Stats 🏆`,
        ``,
        `**\`\`Player\`\`**`,
        `- <@${target.id}>`,
        ``,
        `**\`\`Wins\`\`**`,
        `- ${stats.wins}`,
        ``,
        `**\`\`Losses\`\`**`,
        `- ${stats.losses}`,
        ``,
        `**\`\`Matches Played\`\`**`,
        `- ${stats.matchesPlayed}`,
        ``,
        `**\`\`Tournaments Played\`\`**`,
        `- ${stats.tournamentsPlayed}`,
        ``,
        `**\`\`Tournament Wins\`\`**`,
        `- ${stats.tournamentWins}`,
        ``,
        `**\`\`Teams Played For\`\`**`,
        stats.teams.length > 0
          ? stats.teams.map(t => `- ${t}`).join('\n')
          : '- None',
        ``
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
