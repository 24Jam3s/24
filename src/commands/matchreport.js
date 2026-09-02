// commands/matchreport.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('matchreport')
    .setDescription('Report the winner of a match.')
    .addIntegerOption(o =>
      o.setName('match')
        .setDescription('Match number')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('winner')
        .setDescription('Winning team (Team A, Team B, Team C...)')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.client.tournaments) {
      interaction.client.tournaments = {};
    }

    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t) {
      return interaction.reply({
        content: 'No tournament has been created yet.',
        ephemeral: true
      });
    }

    if (t.status !== 'Started') {
      return interaction.reply({
        content: 'The tournament has not started yet.',
        ephemeral: true
      });
    }

    const matchNumber = interaction.options.getInteger('match');
    const winnerName = interaction.options.getString('winner');

    const match = t.matches[matchNumber - 1];

    if (!match) {
      return interaction.reply({
        content: 'Invalid match number.',
        ephemeral: true
      });
    }

    // Validate winner
    if (
      match.teamA.name.toLowerCase() !== winnerName.toLowerCase() &&
      match.teamB.name.toLowerCase() !== winnerName.toLowerCase()
    ) {
      return interaction.reply({
        content: 'That team is not part of this match.',
        ephemeral: true
      });
    }

    // Store winner but require confirmation
    match.winner = winnerName === match.teamA.name ? match.teamA : match.teamB;
    match.reportedBy = interaction.user.id;
    match.confirmed = false;

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Match Reported 🏆`,
        ``,
        `**Match ${matchNumber}:**`,
        `${match.teamA.name} vs ${match.teamB.name}`,
        ``,
        `**Reported Winner:**`,
        `- ${match.winner.name}`,
        ``,
        `Awaiting confirmation via \`\`/matchconfirm\`\`.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
