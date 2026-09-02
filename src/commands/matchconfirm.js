// commands/matchconfirm.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('matchconfirm')
    .setDescription('Confirm a reported match result.')
    .addIntegerOption(o =>
      o.setName('match')
        .setDescription('Match number')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.client.tournaments) {
      interaction.client.tournaments = {};
    }

    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t) {
      return interaction.reply({
        content: 'No tournament has been created yet.',
        ephemeral: true
      });
    }

    if (t.status !== 'Started') {
      return interaction.reply({
        content: 'The tournament has not started yet.',
        ephemeral: true
      });
    }

    const matchNumber = interaction.options.getInteger('match');
    const match = t.matches[matchNumber - 1];

    if (!match) {
      return interaction.reply({
        content: 'Invalid match number.',
        ephemeral: true
      });
    }

    if (!match.winner) {
      return interaction.reply({
        content: 'This match has not been reported yet.',
        ephemeral: true
      });
    }

    if (match.confirmed) {
      return interaction.reply({
        content: 'This match has already been confirmed.',
        ephemeral: true
      });
    }

    // Confirm the match
    match.confirmed = true;

    // Update player stats
    if (!interaction.client.playerStats) {
      interaction.client.playerStats = {};
    }

    const winnerTeam = match.winner;
    const loserTeam = winnerTeam.name === match.teamA.name ? match.teamB : match.teamA;

    for (const id of winnerTeam.members) {
      if (!interaction.client.playerStats[id]) {
        interaction.client.playerStats[id] = { wins: 0, losses: 0, tournamentWins: 0 };
      }
      interaction.client.playerStats[id].wins++;
    }

    for (const id of loserTeam.members) {
      if (!interaction.client.playerStats[id]) {
        interaction.client.playerStats[id] = { wins: 0, losses: 0, tournamentWins: 0 };
      }
      interaction.client.playerStats[id].losses++;
    }

    // Check if this was the final match
    const allConfirmed = t.matches.every(m => m.confirmed);

    if (allConfirmed && t.matches.length === 1) {
      // Final match → tournament ends
      const embed = new EmbedBuilder()
        .setDescription([
          `# 🏆 Final Match Confirmed 🏆`,
          ``,
          `**Champion Team:**`,
          `- ${winnerTeam.name}`,
          ``,
          `Use \`\`/tournamentend\`\` to finish the tournament.`
        ].join('\n'))
        .setColor(0x0066FF);

      return interaction.reply({ embeds: [embed] });
    }

    // If round is complete → generate next round
    const roundMatches = t.matches.filter(m => m.round === t.currentRound);
    const roundConfirmed = roundMatches.every(m => m.confirmed);

    if (roundConfirmed) {
      // Build next round
      const winners = roundMatches.map(m => m.winner);

      const nextRound = [];
      for (let i = 0; i < winners.length; i += 2) {
        const teamA = winners[i];
        const teamB = winners[i + 1];

        if (!teamB) break; // Odd number → bye

        nextRound.push({
          round: t.currentRound + 1,
          teamA,
          teamB,
          winner: null,
          confirmed: false,
          reportedBy: null
        });
      }

      t.currentRound++;
      t.matches.push(...nextRound);

      const embed = new EmbedBuilder()
        .setDescription([
          `# 🏆 Match Confirmed 🏆`,
          ``,
          `**Winner:**`,
          `- ${winnerTeam.name}`,
          ``,
          `**Next Round Generated:**`,
          ...nextRound.map((m, i) => `Match ${i + 1}: ${m.teamA.name} vs ${m.teamB.name}`)
        ].join('\n'))
        .setColor(0x0066FF);

      return interaction.reply({ embeds: [embed] });
    }

    // Normal confirmation (not final, not end of round)
    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Match Confirmed 🏆`,
        ``,
        `**Winner:**`,
        `- ${winnerTeam.name}`,
        ``,
        `Waiting for other matches in Round ${t.currentRound} to be confirmed...`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
