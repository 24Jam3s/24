import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaguejoin')
    .setDescription('Join the active league match.'),

  async execute(interaction) {
    const league = interaction.client.league;

    if (!league) {
      return interaction.reply({
        content: 'There is no active league.',
        ephemeral: true
      });
    }

    if (league.closed) {
      return interaction.reply({
        content: 'League is full. No more players can join.',
        ephemeral: true
      });
    }

    const user = interaction.user.username;

    if (league.players.includes(user)) {
      return interaction.reply({
        content: 'You are already in the league.',
        ephemeral: true
      });
    }

    league.players.push(user);

    if (league.players.length >= league.maxPlayers) {
      league.closed = true;
    }

    const remainingPlayers = Math.max(0, league.maxPlayers - league.players.length);

    const embed = new EmbedBuilder()
      .setTitle(`${league.matchtype} League (${league.region})`)
      .setDescription([
        `Hosting a \`${league.gametype}\` Game! Need \`${remainingPlayers}\` players to join.`,
        ``,
        `Joined Players:`,
        ...league.players.map(p => `- ${p}`),
        ``,
        `Do /leaguejoin to join.`,
        `host: ${league.host}`,
        ``,
        `Private Server: ${league.privateserver}`
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
