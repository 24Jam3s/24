import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('endgame')
    .setDescription('End a hosted scrim.')
    .addStringOption(o =>
      o.setName('id')
        .setDescription('Scrim ID')
        .setRequired(true)
    ),

  async execute(interaction) {
    const scrimId = interaction.options.getString('id');

    const scrim = interaction.client.scrims?.get(scrimId);
    if (!scrim) {
      return interaction.reply({ content: 'Scrim not found.', ephemeral: true });
    }

    if (scrim.host !== interaction.user.id) {
      return interaction.reply({
        content: 'Only the host can end this game.',
        ephemeral: true
      });
    }

    scrim.active = false;

    await scrim.thread.send('**This game has ended.**');

    await interaction.reply({
      content: 'Game ended successfully.',
      ephemeral: true
    });
  }
};
