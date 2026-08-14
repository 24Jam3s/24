export default {
  customId: /^joinScrim_/,

  async execute(interaction) {
    const parts = interaction.customId.split('_');
    const scrimId = parts[1];
    const playersNeeded = Number(parts[2]);

    const scrim = interaction.client.scrims?.get(scrimId);
    if (!scrim) return interaction.reply({ content: 'Scrim not found.', ephemeral: true });

    // Prevent duplicate joins
    if (scrim.players.includes(interaction.user.id)) {
      return interaction.reply({ content: 'You already joined.', ephemeral: true });
    }

    // Add player
    scrim.players.push(interaction.user.id);

    // Update embed
    const playerList = scrim.players.map(id => `• <@${id}>`).join('\n');

    scrim.embed.setDescription(
      scrim.embed.data.description.replace(
        /\*\*Players Joined:\*\*[\s\S]*/g,
        `**Players Joined:**\n${playerList}`
      )
    );

    await scrim.message.edit({ embeds: [scrim.embed] });

    // Modal
    const modal = new interaction.client.discord.ModalBuilder()
      .setCustomId(`scrimModal_${scrimId}`)
      .setTitle('Join Scrim');

    const usernameInput = new interaction.client.discord.TextInputBuilder()
      .setCustomId('scrim_username')
      .setLabel('Roblox Display Name')
      .setStyle(interaction.client.discord.TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new interaction.client.discord.ActionRowBuilder().addComponents(usernameInput)
    );

    await interaction.showModal(modal);
  }
};
