// commands/matchconfirm.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("matchconfirm")
    .setDescription("Confirm the winner of a match.")
    .addIntegerOption(o =>
      o.setName("match")
        .setDescription("Match number to confirm")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("winner")
        .setDescription("Winning team name (e.g., Team A)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t || t.status !== "Started") {
      return interaction.reply({
        content: "No active tournament.",
        ephemeral: true,
      });
    }

    const matchNumber = interaction.options.getInteger("match");
    const winnerName = interaction.options.getString("winner");

    const match = t.matches[matchNumber - 1];
    if (!match) {
      return interaction.reply({
        content: "Invalid match number.",
        ephemeral: true,
      });
    }

    // Determine winner
    const winner =
      match.teamA.name === winnerName
        ? match.teamA
        : match.teamB && match.teamB.name === winnerName
        ? match.teamB
        : null;

    if (!winner) {
      return interaction.reply({
        content: "Winner name does not match either team.",
        ephemeral: true,
      });
    }

    match.winner = winner;

    // Determine loser
    const loser =
      match.teamA.name === winnerName ? match.teamB : match.teamA;

    // ============================
    // UPDATE PLAYER STATS (NEW)
    // ============================

    // Winner stats
    for (const id of winner.members) {
      if (!interaction.client.playerStats[id]) {
        interaction.client.playerStats[id] = {
          wins: 0,
          losses: 0,
          tournamentWins: 0,
        };
      }
      interaction.client.playerStats[id].wins++;
    }

    // Loser stats
    if (loser) {
      for (const id of loser.members) {
        if (!interaction.client.playerStats[id]) {
          interaction.client.playerStats[id] = {
            wins: 0,
            losses: 0,
            tournamentWins: 0,
          };
        }
        interaction.client.playerStats[id].losses++;
      }
    }

    // ============================
    // CHECK IF ROUND IS COMPLETE
    // ============================

    const allConfirmed = t.matches.every(m => m.winner !== null);

    // FINAL ROUND → ANNOUNCE WINNER
    if (allConfirmed && t.matches.length === 1) {
      const players = winner.members
        .map((id, idx) => `**Player ${idx + 1}:** <@${id}>`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setDescription([
          `# 🏆 Tournament Winner`,
          ``,
          `**${winner.name}**`,
          players,
          ``,
          `🎉 Congratulations to the champions!`,
        ].join("\n"))
        .setColor(0x0066FF);

      delete interaction.client.tournaments[guildId];
      return interaction.reply({ embeds: [embed] });
    }

    // ============================
    // GENERATE NEXT ROUND
    // ============================

    if (allConfirmed) {
      const nextRoundTeams = t.matches.map(m => m.winner);
      const newMatches = [];

      for (let i = 0; i < nextRoundTeams.length; i += 2) {
        const teamA = nextRoundTeams[i];
        const teamB = nextRoundTeams[i + 1] || null;

        newMatches.push({
          round: match.round + 1,
          teamA,
          teamB,
          winner: teamB ? null : teamA, // auto-win if bye
        });
      }

      t.matches = newMatches;
    }

    // ============================
    // BUILD UPDATED BRACKET EMBED
    // ============================

    const rounds = {};
    for (const m of t.matches) {
      if (!rounds[m.round]) rounds[m.round] = [];
      rounds[m.round].push(m);
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
        `# 🏆 Updated Bracket`,
        ``,
        ...roundSections,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
