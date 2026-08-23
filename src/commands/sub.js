import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sub')
    .setDescription('Looking for substitute players.'),

  async execute(interaction) {
    const league = interaction.client.league;

    if (!league) {
      return interaction.reply({ content: 'There is no active league.', ephemeral: true });
    }

    const remaining = Math.max(0, league.maxPlayers - league.players.length);

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1534188793689538681>`,
        `Looking for \`${remaining}\` Sub`,
        `Host is looking for \`${remaining}\` substitute player.`,
        ``,
        `Use /leaguejoin host:<@${league.host.id}> to join!`
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({ embeds: [embed] });
  }
};
