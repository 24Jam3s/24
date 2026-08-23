import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('host')
    .setDescription('Host a league match.')
    .addStringOption(o =>
      o.setName('matchtype')
        .setDescription('DL or CL')
        .setRequired(true)
        .addChoices(
          { name: 'DL', value: 'DL' },
          { name: 'CL', value: 'CL' }
        )
    )
    .addStringOption(o =>
      o.setName('gametype')
        .setDescription('1v1, 2v2, or 3v3')
        .setRequired(true)
        .addChoices(
          { name: '1v1', value: '1v1' },
          { name: '2v2', value: '2v2' },
          { name: '3v3', value: '3v3' }
        )
    )
    .addStringOption(o =>
      o.setName('region')
        .setDescription('EU, NA, Asia')
        .setRequired(true)
        .addChoices(
          { name: 'EU', value: 'EU' },
          { name: 'NA', value: 'NA' },
          { name: 'Asia', value: 'Asia' }
        )
    )
    .addStringOption(o =>
      o.setName('privateserver')
        .setDescription('Private server link')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('maxplayers')
        .setDescription('Max players allowed')
        .setRequired(true)
    ),

  async execute(interaction) {
    const matchtype = interaction.options.getString('matchtype');
    const gametype = interaction.options.getString('gametype');
    const region = interaction.options.getString('region');
    const privateserver = interaction.options.getString('privateserver');
    const maxPlayers = interaction.options.getInteger('maxplayers');
    const host = interaction.user;

    // Create private thread
    const thread = await interaction.channel.threads.create({
      name: `${matchtype}-${region}-League`,
      autoArchiveDuration: 60,
      type: ChannelType.PrivateThread
    });

    await thread.members.add(host.id);

    interaction.client.league = {
      host,
      matchtype,
      gametype,
      region,
      privateserver,
      maxPlayers,
      players: [host],
      thread,
      closed: false,
      teams: []
    };

    const remaining = maxPlayers - 1;

    const embed = new EmbedBuilder()
      .setDescription([
        `<@1534188793689538681>`,
        `<@${host.id}>`,
        `**Hosting a ${matchtype} Match (${region})**`,
        `Hosting a \`${gametype}\` game! Need \`${remaining}\` more players to join.`,
        `Hosted by: \`<@${host.id}>\``,
        ``,
        `Players Joined:`,
        `• <@${host.id}>`,
        ``,
        `/leaguejoin host:${host.id} to join!`
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({ embeds: [embed] });
  }
};
