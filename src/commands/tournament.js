const embed = new EmbedBuilder()
  .setTitle(`🏆 ${type} ${format} 🏆`)
  .setDescription(
`**Prize : ${prize}**

**Tournament Information**
> - Tournament Format :
> ${type} ${format}
> - Entry Capacity :
> ${capacity} Teams
> - Map Pool :
> ${mappool}

**Tournament Rules**
> - Do not enter with players who are unwilling to be your teammate or do not wish to participate.
> - No spectators are allowed during the game (except for @Owner if requested)
> - All players must post results
> - No camo avatars
> - Private servers decided by heads or tails
> - All games are best of 3`
  )
  .setColor(0xFFD700);
