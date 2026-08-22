import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sub')
    .setDescription('Re-post the updated league embed.'),

  async execute(interaction) {
    const league = interaction.client.league;

    if (!league) {
      return interaction.reply({ content: 'There is no active league.', ephemeral: true });
    }

    const remaining = Math.max(0, league.maxPlayers - league.players.length);

    const embed = new EmbedBuilder()
      .setTitle(`Hosting a ${league.matchtype} ${league.region}`)
      .setDescription([
        `Hosting a ${league.gametype} game! Need ${remaining} more player(s) to join.`,
        `Hosted by: ${league.host}`,
        ``,
        `Private Server: ${league.privateserver}`,
        ``,
        `Players Joined:`,
        ...league.players.map(p => `${p}`),
        ``,
        `Use /leaguejoin host:${league.host.username} to join the scrim!`
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({ embeds: [embed] });
  }
};
