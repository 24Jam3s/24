import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournament')
    .setDescription('Create a tournament.')
    .addStringOption(o =>
      o.setName('format')
        .setDescription('DL or CL')
        .setRequired(true)
        .addChoices(
          { name: 'Default Loadout (DL)', value: 'DL' },
          { name: 'Custom Loadout (CL)', value: 'CL' }
        ))
    .addStringOption(o =>
      o.setName('type')
        .setDescription('1v1 / 2v2 / 3v3')
        .setRequired(true)
        .addChoices(
          { name: '1v1', value: '1v1' },
          { name: '2v2', value: '2v2' },
          { name: '3v3', value: '3v3' }
        ))
    .addStringOption(o =>
      o.setName('prize')
        .setDescription('Prize (e.g., Custom Role)')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('capacity')
        .setDescription('8 Teams or 16 Teams')
        .setRequired(true)
        .addChoices(
          { name: '8 Teams', value: '8' },
          { name: '16 Teams', value: '16' }
        ))
    .addStringOption(o =>
      o.setName('mappool')
        .setDescription('RCL Map pool or Legacy Maps')
        .setRequired(true)
        .addChoices(
          { name: 'RCL Map pool', value: 'RCL' },
          { name: 'Legacy Maps', value: 'Legacy' }
        )),

  async execute(interaction) {
    const format = interaction.options.getString('format');
    const type = interaction.options.getString('type');
    const prize = interaction.options.getString('prize');
    const capacity = interaction.options.getString('capacity');
    const mappool = interaction.options.getString('mappool');

    const embed = new EmbedBuilder()
      .setTitle(`${type} ${format} Tournament`)
      .setDescription(
        `Prize: **${prize}**\n\n` +
        `**Tournament Information**\n` +
        `• **Tournament Format:** ${type} ${format}\n` +
        `• **Entry Capacity:** ${capacity} Teams\n` +
        `• **Map Pool:** ${mappool}\n\n` +
        `Use **/jointournament** to enter your team.`
      )
      .setColor(0xFFD700);

    const msg = await interaction.reply({
      content: '@everyone',
      embeds: [embed],
      fetchReply: true
    });

    interaction.client.tournament = {
      format,
      type,
      prize,
      capacity: parseInt(capacity),
      mappool,
      message: msg,
      teams: []
    };

    await interaction.followUp({
      content: 'Tournament created successfully.',
      ephemeral: true
    });
  }
};
