import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('endleague')
    .setDescription('Fully reset and close the current league.'),

  async execute(interaction) {
    if (!interaction.client.league) {
      return interaction.reply({
        content: 'There is no active league to end.',
        ephemeral: true
      });
    }

    interaction.client.league = null;

    return interaction.reply({
      content: 'League has been fully reset. You can now host a new one.',
      ephemeral: false
    });
  }
};
