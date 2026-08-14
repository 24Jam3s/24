export default {
  customId: /^scrimModal_/,

  async execute(interaction) {
    const parts = interaction.customId.split('_');
    const scrimId = parts[1];

    const scrim = interaction.client.scrims?.get(scrimId);
    if (!scrim) {
      return interaction.reply({ content: 'Scrim not found.', ephemeral: true });
    }

    if (!scrim.active) {
      return interaction.reply({
        content: 'This game has ended.',
        ephemeral: true
      });
    }

    const username = interaction.fields.getTextInputValue('scrim_username');

    await scrim.thread.send(
      `**${interaction.user.username}** joined the scrim.\nRoblox: **${username}**`
    );

    await interaction.reply({
      content: 'You have joined the scrim!',
      ephemeral: true
    });
  }
};
