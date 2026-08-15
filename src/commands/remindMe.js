import { SlashCommandBuilder } from 'discord.js';

function parseTime(input) {
  const match = input.match(/(\d+)(s|m|h|d)/i);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24
  };

  return value * multipliers[unit];
}

export default {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription('Set a reminder and get pinged when the time is up.')
    .addStringOption(option =>
      option
        .setName('time')
        .setDescription('Time like 10s, 5m, 2h, 1d')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('What should I remind you about?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const timeInput = interaction.options.getString('time');
    const reminderMessage = interaction.options.getString('message');

    const ms = parseTime(timeInput);

    if (!ms || ms < 1000) {
      return interaction.reply({
        content: 'Invalid time format. Use **10s**, **5m**, **2h**, or **1d**.',
        ephemeral: true
      });
    }

    const userId = interaction.user.id;

    // Store reminder
    interaction.client.reminders ??= [];
    interaction.client.reminders.push({
      userId,
      message: reminderMessage,
      time: Date.now() + ms
    });

    await interaction.reply({
      content: `⏰ I’ll remind you in **${timeInput}**.`,
      ephemeral: true
    });
  }
};
