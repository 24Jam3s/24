// commands/matchconfirm.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('matchconfirm')
    .setDescription('Confirm a reported match result.')
    .addIntegerOption(o =>
      o.setName('matchid')
        .setDescription('The match ID to confirm')
        .setRequired(true)
    ),

  async execute(interaction) {
    const t = interaction.client.tournament;

    if (!t) {
      return interaction.reply({
        content: 'No tournament is currently active.',
        ephemeral: true
      });
    }

    const matchId = interaction.options.getInteger('matchid');
    const match = t.matches[matchId - 1];

    if (!match) {
      return interaction.reply({
        content: 'Invalid match ID.',
        ephemeral: true
      });
    }

    if (match.confirmed) {
      return interaction.reply({
        content: 'This match has already been confirmed.',
        ephemeral: true
      });
    }

    const winnerTeam = match.winner;
    const loserTeam = match.loser;

    // Ensure global stats object exists
    if (!interaction.client.playerStats) {
      interaction.client.playerStats = {};
    }

    // Update stats for winner team
    for (const userId of winnerTeam.members) {
      if (!interaction.client.playerStats[userId]) {
        interaction.client.playerStats[userId] = {
          wins: 0,
          losses: 0,
          matchesPlayed: 0,
          tournamentsPlayed: 0,
          tournamentWins: 0,
          teams: []
        };
      }

      interaction.client.playerStats[userId].wins += 1;
      interaction.client.playerStats[userId].matchesPlayed += 1;

      if (!interaction.client.playerStats[userId].teams.includes(winnerTeam.name)) {
        interaction.client.playerStats[userId].teams.push(winnerTeam.name);
      }
    }

    // Update stats for loser team
    for (const userId of loserTeam.members) {
      if (!interaction.client.playerStats[userId]) {
        interaction.client.playerStats[userId] = {
          wins: 0,
          losses: 0,
          matchesPlayed: 0,
          tournamentsPlayed: 0,
          tournamentWins: 0,
          teams: []
        };
      }

      interaction.client.playerStats[userId].losses += 1;
      interaction.client.playerStats[userId].matchesPlayed += 1;

      if (!interaction.client.playerStats[userId].teams.includes(loserTeam.name)) {
        interaction.client.playerStats[userId].teams.push(loserTeam.name);
      }
    }

    // Mark match as confirmed
    match.confirmed = true;

    // Update bracket winner
    const bracketMatch = t.bracket.find(
      m => m.teamA.name === winnerTeam.name || m.teamB.name === winnerTeam.name
    );

    if (bracketMatch) {
      bracketMatch.winner = winnerTeam;
    }

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 Match Confirmed 🏆`,
        ``,
        `**\`\`Winner\`\`**`,
        `- ${winnerTeam.name}`,
        ``,
        `**\`\`Loser\`\`**`,
        `- ${loserTeam.name}`,
        ``,
        `Global stats have been updated.`,
        `Bracket has been updated.`
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
