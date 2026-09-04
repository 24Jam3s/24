// commands/bracket.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("bracket")
    .setDescription("View the tournament bracket."),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t) {
      return interaction.reply({
        content: "No tournament exists.",
        ephemeral: true,
      });
    }

    // BEFORE START — show teams
    if (t.status !== "Started") {
      const teamSections = t.teamsJoined.map(team => {
        const players = team.members
          .map((id, i) => `**Player ${i + 1}:** <@${id}>`)
          .join("\n");

        return `### ${team.name}\n${players}\n`;
      });

      const embed = new EmbedBuilder()
        .setDescription([
          `# 🏆 Tournament Teams`,
          ``,
          teamSections.length ? teamSections.join("\n") : "No teams have joined yet.",
          ``,
          `Bracket will be generated when the tournament starts.`,
        ].join("\n"))
        .setColor(0x0066FF);

      return interaction.reply({ embeds: [embed] });
    }

    // AFTER START — show full bracket
    const rounds = {};

    for (const match of t.matches) {
      if (!rounds[match.round]) rounds[match.round] = [];
      rounds[match.round].push(match);
    }

    const roundSections = Object.keys(rounds).map(roundNum => {
      const matches = rounds[roundNum];

      const matchLines = matches.map((m, i) => {
        const teamAPlayers = m.teamA.members
          .map((id, idx) => `**Player ${idx + 1}:** <@${id}>`)
          .join("\n");

        const teamBPlayers = m.teamB
          ? m.teamB.members
              .map((id, idx) => `**Player ${idx + 1}:** <@${id}>`)
              .join("\n")
          : "*Bye*";

        return [
          `### Match ${i + 1}`,
          `**${m.teamA.name}**`,
          teamAPlayers,
          ``,
          `**VS**`,
          ``,
          `**${m.teamB ? m.teamB.name : "No Opponent"}**`,
          teamBPlayers,
          ``,
          m.winner ? `Winner: **${m.winner.name}**` : `Winner: *Pending*`,
          ``,
        ].join("\n");
      });

      return [
        `# 🔵 Round ${roundNum}`,
        ``,
        ...matchLines,
      ].join("\n");
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Bracket`,
        ``,
        ...roundSections,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
