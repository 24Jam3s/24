// commands/tournamentstart.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentstart")
    .setDescription("Start the tournament and generate the bracket."),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t) {
      return interaction.reply({
        content: "No tournament has been created.",
        ephemeral: true,
      });
    }

    if (t.status === "Started") {
      return interaction.reply({
        content: "The tournament has already started.",
        ephemeral: true,
      });
    }

    if (t.teamsJoined.length < 2) {
      return interaction.reply({
        content: "You need at least 2 teams to start the tournament.",
        ephemeral: true,
      });
    }

    // Shuffle teams
    const shuffled = [...t.teamsJoined].sort(() => Math.random() - 0.5);

    const matches = [];
    let round = 1;

    for (let i = 0; i < shuffled.length; i += 2) {
      const teamA = shuffled[i];
      const teamB = shuffled[i + 1];

      if (!teamB) {
        // Bye round
        matches.push({
          round,
          teamA,
          teamB: null,
          winner: teamA,
        });
        continue;
      }

      matches.push({
        round,
        teamA,
        teamB,
        winner: null,
      });
    }

    t.matches = matches;
    t.status = "Started";

    // Build embed
    const matchDescriptions = matches.map((m, i) => {
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
      ].join("\n");
    });

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Started`,
        ``,
        ...matchDescriptions,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
