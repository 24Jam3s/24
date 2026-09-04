// commands/matchreport.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("matchreport")
    .setDescription("Report the result of a match.")
    .addIntegerOption(o =>
      o.setName("match")
        .setDescription("Match number")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("winner")
        .setDescription("Winning team name (e.g., Team A)")
        .setRequired(true)
    )
    .addAttachmentOption(o =>
      o.setName("proof")
        .setDescription("Screenshot proof")
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
    const proof = interaction.options.getAttachment("proof");

    const match = t.matches[matchNumber - 1];
    if (!match) {
      return interaction.reply({
        content: "Invalid match number.",
        ephemeral: true,
      });
    }

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

    match.reportedWinner = winner;
    match.proof = proof.url;

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🟦 Match Reported`,
        ``,
        `**Match:** ${matchNumber}`,
        `**Reported Winner:** ${winner.name}`,
        ``,
        `### Team Members`,
        winner.members
          .map((id, idx) => `**Player ${idx + 1}:** <@${id}>`)
          .join("\n"),
        ``,
        `### Proof`,
        `[Click to view screenshot](${proof.url})`,
        ``,
        `Awaiting staff confirmation...`,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
