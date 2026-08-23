import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaguejoin')
    .setDescription('Join the active league match.')
    .addUserOption(o =>
      o.setName('host')
        .setDescription('Host of the league')
        .setRequired(true)
    ),

  async execute(interaction) {
    const league = interaction.client.league;

    if (!league) {
      return interaction.reply({ content: 'There is no active league.', ephemeral: true });
    }

    const user = interaction.user;

    if (league.players.includes(user)) {
      return interaction.reply({ content: 'You are already in the league.', ephemeral: true });
    }

    if (league.closed) {
      return interaction.reply({ content: 'League is full.', ephemeral: true });
    }

    league.players.push(user);

    // Add user to private thread
    await league.thread.members.add(user.id);

    if (league.players.length >= league.maxPlayers) {
      league.closed = true;
    }

    const remaining = Math.max(0, league.maxPlayers - league.players.length);

    const embed = new EmbedBuilder()
      .setDescription([
        `<@${league.host.id}>`,
        `**Hosting a ${league.matchtype} Match (${league.region})**`,
        `Hosting a \`${league.gametype}\` game! Need \`${remaining}\` more players to join.`,
        `Hosted by: \`<@${league.host.id}>\``,
        ``,
        `Players Joined:`,
        ...league.players.map(p => `• <@${p.id}>`),
        ``,
        `/leaguejoin host:${league.host.id} to join!`
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({ embeds: [embed] });
  }
};
