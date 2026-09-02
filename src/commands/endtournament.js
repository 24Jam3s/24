// commands/tournamentend.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentend')
    .setDescription('End the tournament and announce the winner.'),

  async execute(interaction) {

    // Ensure tournaments object exists
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

    // Find final match winner
    const finalMatch = t.matches[t.matches.length - 1];

    if (!finalMatch || !finalMatch.winner) {
      return interaction.reply({
        content: 'The final match has not been completed yet.',
        ephemeral: true
      });
    }

    const winningTeam = finalMatch.winner;

    // Award tournament wins to each player
    if (!interaction.client.playerStats) {
      interaction.client.playerStats = {};
    }

    for (const playerId of winningTeam.members) {
      if (!interaction.client.playerStats[playerId]) {
        interaction.client.playerStats[playerId] = {
          wins: 0,
          losses: 0,
          tournamentWins: 0
        };
      }
      interaction.client.playerStats[playerId].tournamentWins++;
    }

    // Build winner display
    const memberList = winningTeam.members
      .map(id => `- <@${id}>`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Finished! 🏆`,
        ``,
        `**Champion Team:**`,
        `- ${winningTeam.name}`,
        ``,
        `**Players:**`,
        `${memberList}`,
        ``,
        `Congratulations to the winners!`,
        ``,
        `The tournament has now ended.`
      ].join('\n'))
      .setColor(0x0066FF);

    // Reset tournament
    interaction.client.tournaments[guildId] = null;

    return interaction.reply({ embeds: [embed] });
  }
};
