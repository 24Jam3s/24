// commands/tournamentstart.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentstart')
    .setDescription('Start the tournament and generate the bracket.'),

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

    if (t.status === 'Started') {
      return interaction.reply({
        content: 'The tournament has already started.',
        ephemeral: true
      });
    }

    // Determine required team size
    const requiredSize =
      t.gametype === '1v1' ? 1 :
      t.gametype === '2v2' ? 2 :
      t.gametype === '3v3' ? 3 : 1;

    // Only full teams can play
    const fullTeams = t.teamsJoined.filter(team => team.members.length === requiredSize);

    if (fullTeams.length < 2) {
      return interaction.reply({
        content: 'Not enough full teams to start the tournament.',
        ephemeral: true
      });
    }

    // Shuffle teams for random bracket
    const shuffled = fullTeams.sort(() => Math.random() - 0.5);

    // Build matches for Round 1
    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      const teamA = shuffled[i];
      const teamB = shuffled[i + 1];

      if (!teamB) break; // Odd number of teams → last team gets bye

      matches.push({
        round: 1,
        teamA,
        teamB,
        winner: null,
        reportedBy: null
      });
    }

    t.status = 'Started';
    t.currentRound = 1;
    t.bracket = matches;
    t.matches = matches;

    // Build bracket display
    const bracketLines = matches.map((m, i) => {
      return `**Match ${i + 1}:** ${m.teamA.name} vs ${m.teamB.name}`;
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Started! 🏆`,
        ``,
        `**Round 1 Matches:**`,
        ...bracketLines,
        ``,
        `Use \`\`/matchreport\`\` to report match winners.`,
        `Use \`\`/matchconfirm\`\` to confirm results.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
