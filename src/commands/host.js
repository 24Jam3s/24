import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

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
        .setDescription('Private server link (optional)')
        .setRequired(false)
    )
    .addIntegerOption(o =>
      o.setName('maxplayers')
        .setDescription('Max players allowed in the league')
        .setRequired(true)
    ),

  async execute(interaction) {
    const matchtype = interaction.options.getString('matchtype');
    const gametype = interaction.options.getString('gametype');
    const region = interaction.options.getString('region');
    const privateserver = interaction.options.getString('privateserver') || 'None';
    const maxPlayers = interaction.options.getInteger('maxplayers');
    const host = interaction.user.username;

    if (interaction.client.league) {
      return interaction.reply({
        content: 'A league is already active. End it before hosting a new one.',
        ephemeral: true
      });
    }

    interaction.client.league = {
      host,
      matchtype,
      gametype,
      region,
      privateserver,
      maxPlayers,
      players: [host],
      closed: false,
      teams: []
    };

    const remainingPlayers = maxPlayers - 1;

    const embed = new EmbedBuilder()
      .setTitle(`${matchtype} League (${region})`)
      .setDescription([
        `Hosting a \`${gametype}\` Game! Need \`${remainingPlayers}\` players to join.`,
        `Hosted by: \`${host}\``,
        ``,
        `Private Server: ${privateserver}`
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
