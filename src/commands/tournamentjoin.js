// commands/tournamentjoin.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentjoin')
    .setDescription('Join the tournament with a team.')
    .addStringOption(o =>
      o.setName('teamname')
        .setDescription('Your team name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const t = interaction.client.tournament;

    if (!t) {
      return interaction.reply({
        content: 'No tournament has been created yet.',
        ephemeral: true
      });
    }

    const teamname = interaction.options.getString('teamname');

    // Check if team already exists
    const existingTeam = t.teamsJoined.find(
      team => team.name.toLowerCase() === teamname.toLowerCase()
    );

    if (existingTeam) {
      return interaction.reply({
        content: 'A team with that name has already joined.',
        ephemeral: true
      });
    }

    // Create new team
    const newTeam = {
      name: teamname,
      members: [interaction.user.id]
    };

    t.teamsJoined.push(newTeam);

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Team Joined! 🏆`,
        ``,
        `**Team Name:**`,
        `- ${teamname}`,
        ``,
        `**Captain:**`,
        `- <@${interaction.user.id}>`,
        ``,
        `Your team has successfully joined the tournament!`,
        ``,
        `Use \`\`/checkin\`\` 1 hour before the tournament to confirm your entry.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
