// commands/tournamentkick.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentkick")
    .setDescription("Remove a team from the tournament.")
    .addStringOption(o =>
      o.setName("team")
        .setDescription("Team name (e.g., Team A)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t) {
      return interaction.reply({
        content: "No tournament exists.",
        ephemeral: true,
      });
    }

    const teamName = interaction.options.getString("team");
    const teamIndex = t.teamsJoined.findIndex(t => t.name === teamName);

    if (teamIndex === -1) {
      return interaction.reply({
        content: "Team not found.",
        ephemeral: true,
      });
    }

    const team = t.teamsJoined[teamIndex];
    t.teamsJoined.splice(teamIndex, 1);

    const players = team.members
      .map((id, i) => `**Player ${i + 1}:** <@${id}>`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🟥 Team Removed`,
        ``,
        `**${team.name}** has been removed from the tournament.`,
        ``,
        `### Members`,
        players,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
