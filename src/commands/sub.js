import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sub')
    .setDescription('Re-send the league request embed showing remaining players needed.'),

  async execute(interaction) {
    const league = interaction.client.league;

    if (!league) {
      return interaction.reply({
        content: 'There is no active league.',
        ephemeral: true
      });
    }

    const remainingPlayers = Math.max(0, league.maxPlayers - league.players.length);

    const embed = new EmbedBuilder()
      .setTitle(`${league.matchtype} League (${league.region})`)
      .setDescription([
        `Requesting \`${remainingPlayers}\` to join the game!`,
        `Do /joinleague to Join.`,
        `Hosted by \`${league.host}\``
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
