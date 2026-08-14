import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sub')
    .setDescription('Request a substitute player for your scrim.'),

  async execute(interaction) {
    const scrim = interaction.client.scrims?.get(interaction.user.id);

    if (!scrim) {
      return interaction.reply({
        content: 'You do not have an active scrim.',
        ephemeral: true
      });
    }

    if (!scrim.active) {
      return interaction.reply({
        content: 'This game has ended.',
        ephemeral: true
      });
    }

    const roleId = '1534188793689538681';

    const embed = new EmbedBuilder()
      .setTitle('Looking for 1 Sub')
      .setDescription(
        `Host is looking for **1 substitute player**.\n` +
        `Use \`/scrimjoin host:@${interaction.user.username}\` to join.\n\n` +
        `Issues? Join discord.gg/kwhPbxjySc`
      )
      .setColor(0x5865F2);

    // ⭐ Send to original channel, NOT the thread
    await scrim.message.channel.send({
      content: `<@&${roleId}>`,
      embeds: [embed]
    });

    await interaction.reply({
      content: 'Sub request sent in the main channel.',
      ephemeral: true
    });
  }
};
