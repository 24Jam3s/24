module.exports = {
    customId: /^scrimModal_/,

    async execute(interaction) {
        const parts = interaction.customId.split('_');
        const scrimId = parts[1];
        const playersNeeded = parts[2];
        const privateServer = parts[3];

        const username = interaction.fields.getTextInputValue('scrim_username');

        await interaction.reply({
            content: `You joined the scrim!\nUsername: **${username}**\nPrivate Server: ${privateServer}`,
            ephemeral: true
        });
    }
};

