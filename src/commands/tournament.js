const embed = new EmbedBuilder()
  .setTitle(`🏆 ${type} ${format} 🏆`)
  .setDescription(
    `**Prize : ${prize}**\n\n` +

    `**Tournament Information**\n` +
    `> - Tournament Format :\n` +
    `> ${type} ${format}\n` +
    `> - Entry Capacity :\n` +
    `> ${capacity} Teams\n` +
    `> - Map Pool :\n` +
    `> ${mappool}\n\n` +

    `**Tournament Rules**\n\n` +
    `> - Do not enter with players who are unwilling to be your teammate or do not wish to participate.\n` +
    `> - No spectators are allowed during the game (except for @Owner if requested)\n` +
    `> - All players must post results\n` +
    `> - No camo avatars\n` +
    `> - Private servers decided by heads or tails\n` +
    `> - All games are best of 3`
  )
  .setColor(0xFFD700);
