// commands/tournamentend.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentend")
    .setDescription("End the tournament and announce the winner."),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t || t.status !== "Started") {
      return interaction.reply({
        content: "No active tournament to end.",
        ephemeral: true,
      });
    }

    const finalMatch = t.matches[t.matches.length - 1];

    if (!finalMatch || !finalMatch.winner) {
      return interaction.reply({
        content: "Final match has no confirmed winner.",
        ephemeral: true,
      });
    }

    const winner = finalMatch.winner;

    // Give all winners +1 tournament win
    for (const id of winner.members) {
      if (!interaction.client.playerStats[id]) {
        interaction.client.playerStats[id] = {
          wins: 0,
          losses: 0,
          tournamentWins: 0,
        };
      }
      interaction.client.playerStats[id].tournamentWins++;
    }

    const players = winner.members
      .map((id, i) => `**Player ${i + 1}:** <@${id}>`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Finished`,
        ``,
        `### Winner: **${winner.name}**`,
        ``,
        players,
        ``,
        `🎉 Congratulations to the champions!`,
      ].join("\n"))
      .setColor(0x0066FF);

    delete interaction.client.tournaments[guildId];

    return interaction.reply({ embeds: [embed] });
  },
};
