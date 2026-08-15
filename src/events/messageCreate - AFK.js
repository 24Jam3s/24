export default {
  name: 'messageCreate',

  async execute(message, client) {
    if (message.author.bot) return;

    client.afkUsers ??= new Set();

    // Remove AFK when user sends a message
    if (client.afkUsers.has(message.author.id)) {
      const member = message.member;

      if (member.nickname && member.nickname.startsWith("AFK | ")) {
        const newNick = member.nickname.replace("AFK | ", "");
        try {
          await member.setNickname(newNick);
        } catch (err) {
          console.log("Failed to remove AFK nickname:", err);
        }
      }

      client.afkUsers.delete(message.author.id);

      await message.reply(`Welcome back <@${message.author.id}> — AFK removed.`);
      return;
    }

    // Notify when pinging AFK user
    if (message.mentions.users.size > 0) {
      for (const [id] of message.mentions.users) {
        if (client.afkUsers.has(id)) {
          await message.reply(`⚠️ <@${id}> is currently **AFK**.`);
        }
      }
    }
  }
};
