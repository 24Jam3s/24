// commands/bracket.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('bracket')
    .setDescription('View the current tournament bracket.'),

  async execute(interaction) {
    const t = interaction.client.tournament;

    if (!t) {
      return interaction.reply({
        content: 'No tournament has been created yet.',
        ephemeral: true
      });
    }

    if (!t.bracket || t.bracket.length === 0) {
      return interaction.reply({
        content: 'The bracket has not been generated yet. Start the tournament first.',
        ephemeral: true
      });
    }

    const bracketLines = t.bracket.map((match, index) => {
      const teamA = match.teamA ? match.teamA.name : 'TBD';
      const teamB = match.teamB ? match.teamB.name : 'TBD';
      const winner = match.winner ? match.winner.name : 'None';

      return [
        `**Match ${index + 1}**`,
        `- ${teamA} vs ${teamB}`,
        `- Winner: ${winner}`,
        ``
      ].join('\n');
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 Current Tournament Bracket 🏆`,
        ``,
        `**\`\`Round ${t.currentRound}\`\`**`,
        ``,
        bracketLines.join('\n'),
        `Good luck to all teams!`
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
