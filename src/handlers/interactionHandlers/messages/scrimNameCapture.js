export default {
  name: 'scrimNameCapture',

  async execute(message, client) {
    if (!message.channel.isThread()) return;

    // Find scrim by thread ID
    const scrim = [...client.scrims.values()].find(s => s.thread.id === message.channel.id);
    if (!scrim) return;

    // Ignore bot messages
    if (message.author.bot) return;

    // Only accept replies from players
    if (!scrim.players.includes(message.author.id)) return;

    // Save Roblox name
    scrim.robloxNames ??= {};
    scrim.robloxNames[message.author.id] = message.content;

    await message.reply(`Saved your Roblox name: **${message.content}**`);
  }
};
