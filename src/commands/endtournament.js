// commands/tournamentend.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentend')
    .setDescription('End the tournament and declare the winner.')
    .addStringOption(o =>
      o.setName('winner')
        .setDescription('Winning team name')
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

    const winnerName = interaction.options.getString('winner');
    const winnerTeam = t.teams.find(team => team.name.toLowerCase() === winnerName.toLowerCase());

    if (!winnerTeam) {
      return interaction.reply({
        content: 'That team is not in the tournament.',
        ephemeral: true
      });
    }

    // Ensure global stats object exists
    if (!interaction.client.playerStats) {
      interaction.client.playerStats = {};
    }

    // Update stats for all teams that participated
    for (const team of t.teams) {
      for (const userId of team.members) {
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

        // Count tournament participation
        interaction.client.playerStats[userId].tournamentsPlayed += 1;

        // Track team history
        if (!interaction.client.playerStats[userId].teams.includes(team.name)) {
          interaction.client.playerStats[userId].teams.push(team.name);
        }
      }
    }

    // Award tournament wins to the winning team
    for (const userId of winnerTeam.members) {
      interaction.client.playerStats[userId].tournamentWins += 1;
    }

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 Tournament Ended 🏆`,
        ``,
        `**\`\`Winner\`\`**`,
        `- ${winnerTeam.name}`,
        ``,
        `Congratulations to the champions!`,
        ``,
        `Global stats have been updated.`
      ].join('\n'))
      .setColor(0xffd700);

    // Clear tournament
    interaction.client.tournament = null;

    return interaction.reply({ embeds: [embed] });
  }
};
