import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('endgame')
    .setDescription('End your active scrim.'),

  async execute(interaction) {
    const scrim = interaction.client.scrims?.get(interaction.user.id);

    if (!scrim) {
      return interaction.reply({
        content: 'You do not have an active scrim.',
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
