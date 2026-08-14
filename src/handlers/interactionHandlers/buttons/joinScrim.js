const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    customId: /^joinScrim_/,

    async execute(interaction) {
        const parts = interaction.customId.split('_');
        const scrimId = parts[1];
        const playersNeeded = parts[2];
        const privateServer = parts[3];

        const modal = new ModalBuilder()
            .setCustomId(`scrimModal_${scrimId}_${playersNeeded}_${privateServer}`)
            .setTitle('Join Scrim');

        const usernameInput = new TextInputBuilder()
            .setCustomId('scrim_username')
            .setLabel('Roblox Display Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(usernameInput));

        await interaction.showModal(modal);
    }
};

