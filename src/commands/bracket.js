// commands/bracket.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('bracket')
    .setDescription('View the tournament bracket or current team list.'),

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

    // Determine required team size
    const requiredSize =
      t.gametype === '1v1' ? 1 :
      t.gametype === '2v2' ? 2 :
      t.gametype === '3v3' ? 3 : 1;

    // If tournament has NOT started → show team list
    if (t.status !== 'Started') {

      const teamLines = t.teamsJoined.map(team => {
        const members = team.members.map(id => `<@${id}>`).join('\n');
        return `### ${team.name}\n${members}\n`;
      });

      const embed = new EmbedBuilder()
        .setDescription([
          `# 🏆 Current Tournament Teams 🏆`,
          ``,
          `Match Type: **${t.matchtype}**`,
          `Game Type: **${t.gametype} (${requiredSize} players per team)**`,
          ``,
          `## Teams Joined`,
          teamLines.length > 0 ? teamLines.join('\n') : 'No teams have joined yet.',
          ``,
          `Bracket will be generated when the tournament starts.`
        ].join('\n'))
        .setColor(0x0066FF);

      return interaction.reply({ embeds: [embed] });
    }

    // Tournament has started → show full bracket
    const rounds = {};

    // Group matches by round
    for (const match of t.matches) {
      if (!rounds[match.round]) rounds[match.round] = [];
      rounds[match.round].push(match);
    }

    const roundSections = [];

    for (const roundNum of Object.keys(rounds)) {
      const matches = rounds[roundNum];

      const matchLines = matches.map((m, i) => {
        const teamAList = m.teamA.members.map(id => `<@${id}>`).join('\n');
        const teamBList = m.teamB.members.map(id => `<@${id}>`).join('\n');

        return [
          `### Match ${i + 1}`,
          `**${m.teamA.name}**`,
          `${teamAList}`,
          ``,
          `**VS**`,
          ``,
          `**${m.teamB.name}**`,
          `${teamBList}`,
          ``,
          m.winner ? `Winner: **${m.winner.name}**` : `Winner: *Pending*`,
          ``
        ].join('\n');
      });

      roundSections.push([
        `# 🔵 Round ${roundNum}`,
        ``,
        ...matchLines
      ].join('\n'));
    }

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Bracket 🏆`,
        ``,
        ...roundSections
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
