import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('host')
    .setDescription('Host a scrim.')
    .addStringOption(o =>
      o.setName('gametype')
        .setDescription('Gametype')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('players')
        .setDescription('Players needed')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('region')
        .setDescription('Region')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('privateserver')
        .setDescription('Private server link')
        .setRequired(true)),

  async execute(interaction, client) {
    const gametype = interaction.options.getString('gametype');
    const playersNeeded = interaction.options.getInteger('players');
    const region = interaction.options.getString('region');
    const privateServer = interaction.options.getString('privateserver');

    const roleId = '<@&1534188793689538681>';

    const embed = new EmbedBuilder()
      .setTitle(`Hosting a Scrim (${region})
      .setDescription(
        `Gametype: **${gametype}**\n` +
        `Need **${playersNeeded}** players.\n` +
        `Hosted by: ${interaction.user.username}`
      )
      .setColor(0x5865F2);

    const joinButton = new ButtonBuilder()
      .setCustomId(`joinScrim_${interaction.id}_${playersNeeded}_${privateServer}`)
      .setLabel('Join Game')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(joinButton);

    await interaction.reply({
      content: `${roleId}`,
      embeds: [embed],
      components: [row]
    });
  }
};
