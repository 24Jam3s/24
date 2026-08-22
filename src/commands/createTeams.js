import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('createteams')
    .setDescription('Auto-create teams for the league.'),

  async execute(interaction) {
    const league = interaction.client.league;

    if (!league) {
      return interaction.reply({ content: 'No active league.', ephemeral: true });
    }

    const gametype = league.gametype;
    const size = parseInt(gametype[0]); // 1v1 → 1, 2v2 → 2, 3v3 → 3

    const teams = [];
    const players = league.players;

    for (let i = 0; i < players.length; i += size) {
      const chunk = players.slice(i, i + size);
      if (chunk.length === size) teams.push(chunk);
    }

    league.teams = teams;

    return interaction.reply({
      content: teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n')
    });
  }
};
