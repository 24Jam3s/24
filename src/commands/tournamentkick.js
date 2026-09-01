// commands/tournamentkick.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentkick')
    .setDescription('Remove a team from the tournament.')
    .addStringOption(o =>
      o.setName('team')
        .setDescription('Team name (Team A, Team B, Team C...)')
        .setRequired(true)
    ),

  async execute(interaction) {

    // Ensure tournaments object exists
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

    const teamName = interaction.options.getString('team');

    // Find team
    const teamIndex = t.teamsJoined.findIndex(
      team => team.name.toLowerCase() === teamName.toLowerCase()
    );

    if (teamIndex === -1) {
      return interaction.reply({
        content: 'That team does not exist in the tournament.',
        ephemeral: true
      });
    }

    const removedTeam = t.teamsJoined[teamIndex];

    // Remove team from tournament
    t.teamsJoined.splice(teamIndex, 1);

    // Remove team from bracket
    t.bracket = t.bracket.filter(match =>
      match.teamA.name !== removedTeam.name &&
      match.teamB.name !== removedTeam.name &&
      match.winner?.name !== removedTeam.name
    );

    // Reassign team letters (Team A, Team B, Team C...)
    t.teamsJoined.forEach((team, i) => {
      team.name = `Team ${String.fromCharCode(65 + i)}`;
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Team Removed 🏆`,
        ``,
        `**Removed Team:**`,
        `- ${removedTeam.name}`,
        ``,
        `They have been removed from the tournament and bracket.`,
        `A new team may now join using \`\`/tournamentjoin\`\`.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
