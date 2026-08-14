export default {
  customId: /^joinScrim_/,

  async execute(interaction, client) {
    const parts = interaction.customId.split('_');
    const scrimId = parts[1];
    const playersNeeded = parts[2];
    const privateServer = parts[3];

    const modal = new client.discord.ModalBuilder()
      .setCustomId(`scrimModal_${scrimId}_${playersNeeded}_${privateServer}`)
      .setTitle('Join Scrim');

    const usernameInput = new client.discord.TextInputBuilder()
      .setCustomId('scrim_username')
      .setLabel('Roblox Display Name')
      .setStyle(client.discord.TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new client.discord.ActionRowBuilder().addComponents(usernameInput)
    );

    await interaction.showModal(modal);
  }
};
