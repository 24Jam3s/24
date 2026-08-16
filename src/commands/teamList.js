import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('teamlist')
    .setDescription('Show all teams registered in the tournament.'),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    if (tournament.teams.length === 0) {
      return interaction.reply({
        content: 'No teams have joined yet.',
        ephemeral: true
      });
    }

    let list = '';
    let count = 1;

    for (const team of tournament.teams) {
      list += `${count}. ${team.user}`;
      if (team.teammate1) list += ` + ${team.teammate1}`;
      if (team.teammate2) list += ` + ${team.teammate2}`;
      list += '\n';
      count++;
    }

    return interaction.reply({
      content: `**Registered Teams:**\n${list}`,
      ephemeral: false
    });
  }
};
