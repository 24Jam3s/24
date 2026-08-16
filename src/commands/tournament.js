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
      .setTitle(`🏆 ${type} ${format} 🏆`)
      .setDescription([
        `**Prize : ${prize}**`,
        ``,
        `**Tournament Information**`,
        `> - Tournament Format :`,
        `> ${type} ${format}`,
        `> - Entry Capacity :`,
        `> ${capacity} Teams`,
        `> - Map Pool :`,
        `> ${mappool}`,
        ``,
        `**Tournament Rules**`,
        `> - Do not enter with players who are unwilling to be your teammate or do not wish to participate.`,
        `> - No spectators are allowed during the game (except for @Owner if requested)`,
        `> - All players must post results`,
        `> - No camo avatars`,
        `> - Private servers decided by heads or tails`,
        `> - All games are best of 3`
      ].join('\n'))
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
