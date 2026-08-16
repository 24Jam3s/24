import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('closetournament')
    .setDescription('Close and delete the current tournament.'),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    const channel = interaction.client.channels.cache.get('1531327666316116049');

    await channel.send(
      `⚠️ **The tournament has been closed.**\n` +
      `All data has been cleared.`
    );

    interaction.client.tournament = null;

    return interaction.reply({
      content: 'Tournament closed.',
      ephemeral: true
    });
  }
};
