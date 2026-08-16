import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('jointournament')
    .setDescription('Join the active tournament.')
    .addStringOption(o =>
      o.setName('teammate1')
        .setDescription('First teammate (optional)')
        .setRequired(false)
    )
    .addStringOption(o =>
      o.setName('teammate2')
        .setDescription('Second teammate (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    if (tournament.started) {
      return interaction.reply({
        content: 'Tournament has already started.',
        ephemeral: true
      });
    }

    const user = interaction.user.username;
    const teammate1 = interaction.options.getString('teammate1');
    const teammate2 = interaction.options.getString('teammate2');

    tournament.teams.push({
      user,
      teammate1,
      teammate2
    });

    return interaction.reply({
      content: `Team joined: ${user}${teammate1 ? ' + ' + teammate1 : ''}${teammate2 ? ' + ' + teammate2 : ''}`,
      ephemeral: true
    });
  }
};
