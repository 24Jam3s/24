// commands/tournamentkick.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentkick")
    .setDescription("Remove a team from the tournament.")
    .addStringOption(o =>
      o.setName("team")
        .setDescription("Team name or partial name")
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

    if (!t.teamsJoined || t.teamsJoined.length === 0) {
      return interaction.reply({
        content: "No teams have joined the tournament.",
        ephemeral: true,
      });
    }

    const input = interaction.options.getString("team").toLowerCase();

    // Find partial match
    const matches = t.teamsJoined.filter(team =>
      team.name.toLowerCase().includes(input)
    );

    if (matches.length === 0) {
      const list = t.teamsJoined.map(t => `• ${t.name}`).join("\n");

      return interaction.reply({
        content: `Team not found.\n\nAvailable teams:\n${list}`,
        ephemeral: true,
      });
    }

    if (matches.length > 1) {
      const list = matches.map(t => `• ${t.name}`).join("\n");

      return interaction.reply({
        content: `Multiple teams match your input:\n${list}\n\nPlease type more of the name.`,
        ephemeral: true,
      });
    }

    // Single match → remove team
    const team = matches[0];

    t.teamsJoined = t.teamsJoined.filter(t => t.name !== team.name);

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
