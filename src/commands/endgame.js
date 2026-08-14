import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('endgame')
    .setDescription('End your active scrim and delete the thread.'),

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
        content: 'This scrim has already ended.',
        ephemeral: true
      });
    }

    // Mark scrim inactive
    scrim.active = false;

    // Announce before deletion
    await scrim.thread.send('**This game has ended. The thread will now be deleted.**');

    // Delete the thread
    try {
      await scrim.thread.delete();
    } catch (err) {
      console.error('Failed to delete thread:', err);
    }

    // Confirm to host
    await interaction.reply({
      content: 'Game ended and thread deleted.',
      ephemeral: true
    });
  }
};
