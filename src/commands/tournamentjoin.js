// commands/tournamentjoin.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentjoin')
    .setDescription('Join the tournament as a player.'),

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

    const userId = interaction.user.id;

    // Determine required team size
    const requiredSize =
      t.gametype === '1v1' ? 1 :
      t.gametype === '2v2' ? 2 :
      t.gametype === '3v3' ? 3 : 1;

    // Check if user is already in a team
    const alreadyInTeam = t.teamsJoined.some(team =>
      team.members.includes(userId)
    );

    if (alreadyInTeam) {
      return interaction.reply({
        content: 'You are already in a team.',
        ephemeral: true
      });
    }

    // Try to find a team that is not full
    let team = t.teamsJoined.find(team => team.members.length < requiredSize);

    // If no team exists or all teams are full → create new team
    if (!team) {
      const teamLetter = String.fromCharCode(65 + t.teamsJoined.length);
      team = {
        name: `Team ${teamLetter}`,
        members: []
      };
      t.teamsJoined.push(team);
    }

    // Add player to team
    team.members.push(userId);

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Join Successful 🏆`,
        ``,
        `**Team:**`,
        `- ${team.name}`,
        ``,
        `**Player Added:**`,
        `- <@${userId}>`,
        ``,
        `Team size: \`${team.members.length}/${requiredSize}\``,
        ``,
        team.members.length === requiredSize
          ? `Your team is now **FULL** and ready for the tournament!`
          : `Waiting for more players to join your team...`,
        ``,
        `Use \`\`/checkin\`\` 1 hour before the tournament to confirm your entry.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
