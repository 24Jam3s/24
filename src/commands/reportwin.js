// commands/matchreport.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('matchreport')
    .setDescription('Report the result of a match.')
    .addStringOption(o =>
      o.setName('winner')
        .setDescription('Winning team name')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('loser')
        .setDescription('Losing team name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const t = interaction.client.tournament;

    if (!t) {
      return interaction.reply({
        content: 'No tournament is currently active.',
        ephemeral: true
      });
    }

    const winnerName = interaction.options.getString('winner');
    const loserName = interaction.options.getString('loser');

    const winnerTeam = t.teams.find(team => team.name.toLowerCase() === winnerName.toLowerCase());
    const loserTeam = t.teams.find(team => team.name.toLowerCase() === loserName.toLowerCase());

    if (!winnerTeam || !loserTeam) {
      return interaction.reply({
        content: 'One or both team names are invalid.',
        ephemeral: true
      });
    }

    // Store pending match report
    t.matches.push({
      winner: winnerTeam,
      loser: loserTeam,
      confirmed: false
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 Match Reported 🏆`,
        ``,
        `**\`\`Winner\`\`**`,
        `- ${winnerTeam.name}`,
        ``,
        `**\`\`Loser\`\`**`,
        `- ${loserTeam.name}`,
        ``,
        `Awaiting confirmation from staff using /matchconfirm.`
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
