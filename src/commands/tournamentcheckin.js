// commands/tournamentcheckin.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentcheckin')
    .setDescription('Check in for the tournament.')
    .addStringOption(o =>
      o.setName('teamname')
        .setDescription('Your team name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const t = interaction.client.tournament;

    if (!t) {
      return interaction.reply({
        content: 'No tournament created yet.',
        ephemeral: true
      });
    }

    const teamname = interaction.options.getString('teamname');
    const team = t.teams.find(team => team.name.toLowerCase() === teamname.toLowerCase());

    if (!team) {
      return interaction.reply({
        content: 'Team not found.',
        ephemeral: true
      });
    }

    // Add player to team if not already added
    if (!team.members.includes(interaction.user.id)) {
      team.members.push(interaction.user.id);
    }

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 Check-In Successful! 🏆`,
        ``,
        `**\`\`Checked In\`\`**`,
        `- <@${interaction.user.id}>`,
        ``,
        `**\`\`Tournament\`\`**`,
        `- Gametype: ${t.gametype}`,
        `- Matchtype: ${t.matchtype}`,
        `- Time: ${t.time}`,
        ``,
        `You are now confirmed for the tournament!`
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
