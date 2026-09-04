// commands/playerstats.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("playerstats")
    .setDescription("Show stats for a player.")
    .addUserOption(o =>
      o.setName("player")
        .setDescription("Player to view")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("player");
    const stats = interaction.client.playerStats[user.id];

    if (!stats) {
      return interaction.reply({
        content: `${user} has no recorded stats.`,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🟦 Player Stats`,
        ``,
        `**Player:** <@${user.id}>`,
        ``,
        `**Wins:** ${stats.wins}`,
        `**Losses:** ${stats.losses}`,
        `**Tournament Wins:** ${stats.tournamentWins}`,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
