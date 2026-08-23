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

    const size = parseInt(league.gametype[0]);
    const players = league.players;
    const teams = [];

    for (let i = 0; i < players.length; i += size) {
      const chunk = players.slice(i, i + size);
      if (chunk.length === size) teams.push(chunk);
    }

    league.teams = teams;

    return interaction.reply({
      content: teams.map((t, i) => `Team ${i + 1}: ${t.map(p => `<@${p.id}>`).join(', ')}`).join('\n')
    });
  }
};
