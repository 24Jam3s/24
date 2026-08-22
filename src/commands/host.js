import {
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('host')
    .setDescription('Host a scrim match.')
    .addStringOption(o =>
      o.setName('gametype')
        .setDescription('Choose 2s or 3s')
        .setRequired(true)
        .addChoices(
          { name: '2s', value: '2s' },
          { name: '3s', value: '3s' }
        ))
    .addStringOption(o =>
      o.setName('matchtype')
        .setDescription('DL = Default Loadout, CL = Custom Loadout')
        .setRequired(true)
        .addChoices(
          { name: 'Default Loadout (DL)', value: 'DL' },
          { name: 'Custom Loadout (CL)', value: 'CL' }
        ))
    .addStringOption(o =>
      o.setName('region')
        .setDescription('Select region')
        .setRequired(true)
        .addChoices(
          { name: 'EU', value: 'EU' },
          { name: 'Asia', value: 'Asia' },
          { name: 'NA', value: 'NA' }
        ))
    .addStringOption(o =>
      o.setName('privateserver')
        .setDescription('Private server link')
        .setRequired(true)
    ),

  async execute(interaction) {
    const gametype = interaction.options.getString('gametype');
    const matchtype = interaction.options.getString('matchtype');
    const region = interaction.options.getString('region');
    const privateServer = interaction.options.getString('privateserver');

    const playersNeeded = gametype === '2s' ? 3 : 1;
    const roleId = '1534188793689538681';

    const embed = new EmbedBuilder()
      .setTitle(`Hosting a Lower ${matchtype} Match (${region})`)
      .setDescription(
        `Hosting a **${gametype}** game! Need **${playersNeeded}** more player(s) to join.\n` +
        `Hosted by: **${interaction.user.username}**\n\n` +
        `Private Server: ${privateServer}\n\n` +
        `**Players Joined:**\n• <@${interaction.user.id}> *(host)*\n\n` +
        `Use **/scrimjoin host:@${interaction.user.username}** to join the scrim!`
      )
      .setColor(0x5865F2);

    const msg = await interaction.reply({
      content: `<@&${roleId}>`,
      embeds: [embed],
      fetchReply: true
    });

    const thread = await msg.startThread({
      name: `${gametype} Scrim (${region})`,
      autoArchiveDuration: 60
    });

    // ⭐ Add host to thread automatically
    await thread.members.add(interaction.user.id);

    // ⭐ Host auto‑joins scrim internally but does NOT count toward playersNeeded
    interaction.client.scrims ??= new Map();
    interaction.client.scrims.set(interaction.user.id, {
      players: [], // host not counted here
      host: interaction.user.id,
      message: msg,
      embed,
      thread,
      active: true,
      playersNeeded
    });

    await interaction.followUp({
      content: 'Scrim created. Players should use /scrimjoin to enter your game.',
      ephemeral: true
    });
  }
};
