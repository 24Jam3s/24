// commands/tournamentjoin.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentjoin')
    .setDescription('Join the tournament by selecting the players.')
    .addUserOption(o =>
      o.setName('player1')
        .setDescription('First player')
        .setRequired(true)
    )
    .addUserOption(o =>
      o.setName('player2')
        .setDescription('Second player')
        .setRequired(false)
    )
    .addUserOption(o =>
      o.setName('player3')
        .setDescription('Third player (for 3v3)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const t = interaction.client.tournament;

    if (!t) {
      return interaction.reply({
        content: 'No tournament has been created yet.',
        ephemeral: true
      });
    }

    // Collect players
    const p1 = interaction.options.getUser('player1');
    const p2 = interaction.options.getUser('player2');
    const p3 = interaction.options.getUser('player3');

    const players = [p1, p2, p3].filter(Boolean);

    // Auto‑assign team name (Team A, Team B, Team C...)
    const teamLetter = String.fromCharCode(65 + t.teamsJoined.length); // 65 = A
    const teamName = `Team ${teamLetter}`;

    // Check if any player is already in a team
    for (const team of t.teamsJoined) {
      for (const member of team.members) {
        if (players.some(p => p.id === member)) {
          return interaction.reply({
            content: 'One or more selected players are already in a team.',
            ephemeral: true
          });
        }
      }
    }

    // Create team
    const newTeam = {
      name: teamName,
      members: players.map(p => p.id)
    };

    t.teamsJoined.push(newTeam);

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Team Joined! 🏆`,
        ``,
        `**Team Assigned:**`,
        `- ${teamName}`,
        ``,
        `**Players:**`,
        ...players.map(p => `- <@${p.id}>`),
        ``,
        `Your team has successfully joined the tournament!`,
        ``,
        `Use \`\`/checkin\`\` 1 hour before the tournament to confirm your entry.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
