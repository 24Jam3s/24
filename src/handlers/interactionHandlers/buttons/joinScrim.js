import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from 'discord.js';

export default {
  name: 'joinScrim',

  async execute(interaction) {
    if (!interaction.customId.startsWith('joinScrim_')) return;

    const hostId = interaction.customId.split('_')[1];
    const scrim = interaction.client.scrims?.get(hostId);

    if (!scrim) {
      return interaction.reply({ content: 'Scrim not found.', ephemeral: true });
    }

    if (!scrim.active) {
      return interaction.reply({
        content: 'This game has ended.',
        ephemeral: true
      });
    }

    if (scrim.players.length >= scrim.playersNeeded) {
      return interaction.reply({
        content: 'This game is already full. You cannot join.',
        ephemeral: true
      });
    }

    if (scrim.players.includes(interaction.user.id)) {
      return interaction.reply({
        content: 'You already joined.',
        ephemeral: true
      });
    }

    scrim.players.push(interaction.user.id);

    const playerList = scrim.players.map(id => `• <@${id}>`).join('\n');

    scrim.embed.setDescription(
      scrim.embed.data.description.replace(
        /\*\*Players Joined:\*\*[\s\S]*/g,
        `**Players Joined:**\n${playerList}`
      )
    );

    await scrim.message.edit({ embeds: [scrim.embed] });

    const modal = new ModalBuilder()
      .setCustomId(`scrimModal_${hostId}`)
      .setTitle('Join Scrim');

    const usernameInput = new TextInputBuilder()
      .setCustomId('scrim_username')
      .setLabel('Roblox Display Name')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(usernameInput)
    );

    await interaction.showModal(modal);
  }
};
