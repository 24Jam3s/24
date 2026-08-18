import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('createteams')
    .setDescription('Create teams automatically based on tournament type.')
    .addStringOption(o =>
      o.setName('host')
        .setDescription('Host of the tournament')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('players')
        .setDescription('Comma-separated list of all players')
        .setRequired(true)
    ),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    const host = interaction.options.getString('host');
    const playersRaw = interaction.options.getString('players');

    // Convert comma-separated list into array
    let players = playersRaw.split(',').map(p => p.trim());

    // Include host automatically
    if (!players.includes(host)) {
      players.unshift(host);
    }

    // Remove duplicates
    players = [...new Set(players)];

    const maxPlayers = tournament.capacity; // 8 or 16

    // Prevent overflow
    if (players.length > maxPlayers) {
      return interaction.reply({
        content: `Too many players! Max allowed is ${maxPlayers}, but you provided ${players.length}.`,
        ephemeral: true
      });
    }

    // Prevent joining after full
    if (tournament.teams.length >= maxPlayers) {
      return interaction.reply({
        content: `Tournament is full. No more players can join.`,
        ephemeral: true
      });
    }

    // Auto team splitting
    const teamSize = tournament.type === '1v1' ? 1 :
                     tournament.type === '2v2' ? 2 :
                     tournament.type === '3v3' ? 3 : 1;

    const teams = [];
    for (let i = 0; i < players.length; i += teamSize) {
      const teamPlayers = players.slice(i, i + teamSize);

      // If last team is incomplete, stop
      if (teamPlayers.length < teamSize) break;

      teams.push({
        members: teamPlayers
      });
    }

    // Save teams to tournament
    tournament.teams = teams;

    return interaction.reply({
      content: `Teams created successfully.\n\n${teams
        .map((t, i) => `Team ${i + 1}: ${t.members.join(', ')}`)
        .join('\n')}`,
      ephemeral: false
    });
  }
};
