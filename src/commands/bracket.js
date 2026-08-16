import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('bracket')
    .setDescription('Generate the static tournament bracket.'),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    if (tournament.teams.length < 2) {
      return interaction.reply({
        content: 'Not enough teams to generate a bracket.',
        ephemeral: true
      });
    }

    const teams = [...tournament.teams];

    // Shuffle teams for randomness
    for (let i = teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teams[i], teams[j]] = [teams[j], teams[i]];
    }

    let bracket = `**${tournament.capacity}-Team Bracket**\n\n`;

    for (let i = 0; i < teams.length; i += 2) {
      const team1 = teams[i];
      const team2 = teams[i + 1];

      const team1Name = team1.teammate1
        ? `${team1.user} + ${team1.teammate1}${team1.teammate2 ? ' + ' + team1.teammate2 : ''}`
        : team1.user;

      const team2Name = team2
        ? (team2.teammate1
            ? `${team2.user} + ${team2.teammate1}${team2.teammate2 ? ' + ' + team2.teammate2 : ''}`
            : team2.user)
        : 'BYE';

      bracket += `Match ${i / 2 + 1}: **${team1Name}** vs **${team2Name}**\n`;
    }

    return interaction.reply({
      content: bracket,
      ephemeral: false
    });
  }
};
