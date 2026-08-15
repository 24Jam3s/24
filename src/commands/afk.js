import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set yourself as AFK.'),

  async execute(interaction) {
    const member = interaction.member;

    // Already AFK?
    if (member.nickname && member.nickname.startsWith("AFK | ")) {
      return interaction.reply({
        content: 'You are already marked as AFK.',
        ephemeral: true
      });
    }

    // Add AFK prefix
    const newNick = member.nickname
      ? `AFK | ${member.nickname}`
      : `AFK | ${member.user.username}`;

    try {
      await member.setNickname(newNick);
    } catch (err) {
      console.log("Nickname change failed:", err);
    }

    // Store AFK state
    interaction.client.afkUsers ??= new Set();
    interaction.client.afkUsers.add(member.id);

    return interaction.reply({
      content: 'You are now marked as AFK.',
      ephemeral: true
    });
  }
};
