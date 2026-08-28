// commands/tournamentstart.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentstart')
    .setDescription('Start the tournament and generate the first bracket.'),

  async execute(interaction) {
    const t = interaction.client.tournament;

    if (!t) {
      return interaction.reply({
        content: 'No tournament has been created yet.',
        ephemeral: true
      });
    }

    if (t.teams.length < 2) {
      return interaction.reply({
        content: 'At least two teams are required to start the tournament.',
        ephemeral: true
      });
    }

    // Shuffle teams for fairness
    const shuffled = [...t.teams].sort(() => Math.random() - 0.5);

    // Generate bracket pairs
    t.bracket = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      const teamA = shuffled[i];
      const teamB = shuffled[i + 1] || null;

      t.bracket.push({
        round: 1,
        teamA,
        teamB,
        winner: null
      });
    }

    t.status = 'In Progress';
    t.currentRound = 1;

    const bracketLines = t.bracket.map((match, index) => {
      if (!match.teamB) {
        return `**Match ${index + 1}:** ${match.teamA.name} — *Auto-Advance (no opponent)*`;
      }
      return `**Match ${index + 1}:** ${match.teamA.name} vs ${match.teamB.name}`;
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 Tournament Started 🏆`,
        ``,
        `**\`\`Gametype\`\`**`,
        `- ${t.gametype}`,
        ``,
        `**\`\`Matchtype\`\`**`,
        `- ${t.matchtype}`,
        ``,
        `**\`\`Round 1 Bracket\`\`**`,
        bracketLines.join('\n'),
        ``,
        `Good luck to all teams!`
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
