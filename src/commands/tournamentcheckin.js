// commands/checkin.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("checkin")
    .setDescription("Check in your entire team for the tournament."),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!interaction.client.tournaments) {
      interaction.client.tournaments = {};
    }

    const t = interaction.client.tournaments[guildId];

    if (!t) {
      return interaction.reply({
        content: "No tournament has been created yet.",
        ephemeral: true,
      });
    }

    if (t.status === "Started") {
      return interaction.reply({
        content: "The tournament has already started.",
        ephemeral: true,
      });
    }

    const user = interaction.user;

    // Find the team the user belongs to
    const team = t.teamsJoined.find(team =>
      team.members.some(m => m.includes(user.id) || m.includes(`<@${user.id}>`))
    );

    if (!team) {
      return interaction.reply({
        content: "You are not part of any team.",
        ephemeral: true,
      });
    }

    // Mark team as checked in
    team.checkedIn = true;

    const playerLines = team.members
      .map((p, i) => `**Player ${i + 1}:** ${p}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🟦 Team Check-In`,
        ``,
        `**Team:** ${team.name}`,
        ``,
        `### Members`,
        playerLines,
        ``,
        `✅ Your team is now checked in!`,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
