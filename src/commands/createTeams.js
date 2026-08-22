import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('createteams')
    .setDescription('Auto-split league players into teams.')
    .addIntegerOption(o =>
      o.setName('teamsize')
        .setDescription('Team size: 1, 2, or 3')
        .setRequired(true)
    ),

  async execute(interaction) {
    const league = interaction.client.league;

    if (!league) {
      return interaction.reply({
        content: 'There is no active league.',
        ephemeral: true
      });
    }

    const teamSize = interaction.options.getInteger('teamsize');

    if (![1, 2, 3].includes(teamSize)) {
      return interaction.reply({
        content: 'Invalid team size. Must be 1, 2, or 3.',
        ephemeral: true
      });
    }

    const players = league.players;

    if (players.length < teamSize) {
      return interaction.reply({
        content: `Not enough players to create teams of size ${teamSize}.`,
        ephemeral: true
      });
    }

    const teams = [];
    for (let i = 0; i < players.length; i += teamSize) {
      const teamPlayers = players.slice(i, i + teamSize);

      if (teamPlayers.length === teamSize) {
        teams.push(teamPlayers);
      }
    }

    league.teams = teams;

    return interaction.reply({
      content:
        `Teams created successfully.\n\n` +
        teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n'),
      ephemeral: false
    });
  }
};
