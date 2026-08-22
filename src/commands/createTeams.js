import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('createteams')
    .setDescription('Create a scrim and auto-split players into teams.')
    .addStringOption(o =>
      o.setName('host')
        .setDescription('Host of the scrim')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('players')
        .setDescription('Comma-separated list of all players')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('teamsize')
        .setDescription('Team size: 1, 2, or 3')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('maxplayers')
        .setDescription('Maximum number of players allowed in the scrim')
        .setRequired(true)
    ),

  async execute(interaction) {
    const host = interaction.options.getString('host');
    const playersRaw = interaction.options.getString('players');
    const teamSize = interaction.options.getInteger('teamsize');
    const maxPlayers = interaction.options.getInteger('maxplayers');

    // Create scrim object if not exists
    if (!interaction.client.scrim) {
      interaction.client.scrim = {
        players: [],
        teams: [],
        closed: false,
        host
      };
    }

    const scrim = interaction.client.scrim;

    // If scrim is already full, block joining
    if (scrim.closed) {
      return interaction.reply({
        content: 'Scrim is already full. No more players can join.',
        ephemeral: true
      });
    }

    // Convert comma-separated list into array
    let players = playersRaw.split(',').map(p => p.trim());

    // Include host automatically
    if (!players.includes(host)) {
      players.unshift(host);
    }

    // Remove duplicates
    players = [...new Set(players)];

    // Check if adding these players exceeds max
    if (scrim.players.length + players.length > maxPlayers) {
      return interaction.reply({
        content: `Too many players! Scrim max is ${maxPlayers}. Current: ${scrim.players.length}. You tried to add ${players.length}.`,
        ephemeral: true
      });
    }

    // Add players to scrim
    for (const p of players) {
      if (!scrim.players.includes(p)) {
        scrim.players.push(p);
      }
    }

    // If scrim is now full, close it
    if (scrim.players.length >= maxPlayers) {
      scrim.closed = true;
    }

    // Auto team splitting
    const teams = [];
    for (let i = 0; i < scrim.players.length; i += teamSize) {
      const teamPlayers = scrim.players.slice(i, i + teamSize);

      if (teamPlayers.length === teamSize) {
        teams.push(teamPlayers);
      }
    }

    scrim.teams = teams;

    return interaction.reply({
      content:
        `Scrim created successfully.\n\n` +
        `Players (${scrim.players.length}/${maxPlayers}): ${scrim.players.join(', ')}\n\n` +
        `Teams:\n` +
        teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n') +
        (scrim.closed ? `\n\nScrim is now FULL and closed.` : ``),
      ephemeral: false
    });
  }
};
