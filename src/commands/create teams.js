import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('createteams')
    .setDescription('Create random teams from players who joined your scrim.'),

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

    if (scrim.players.length < 2) {
      return interaction.reply({
        content: 'Not enough players joined to create teams.',
        ephemeral: true
      });
    }

    // Shuffle players randomly
    const shuffled = [...scrim.players].sort(() => Math.random() - 0.5);

    // Split into two teams
    const half = Math.ceil(shuffled.length / 2);
    const yellowTeam = shuffled.slice(0, half);
    const purpleTeam = shuffled.slice(half);

    const yellowList = yellowTeam.map(id => `<@${id}>`).join(', ');
    const purpleList = purpleTeam.map(id => `<@${id}>`).join(', ');

    const embed = new EmbedBuilder()
      .setTitle('Teams Created')
      .setDescription(
        `**Yellow Pad:**\n${yellowList}\n\n` +
        `**Purple Pad:**\n${purpleList}`
      )
      .setColor(0xFFD700);

    await scrim.thread.send({ embeds: [embed] });

    await interaction.reply({
      content: 'Teams created successfully.',
      ephemeral: true
    });
  }
};
