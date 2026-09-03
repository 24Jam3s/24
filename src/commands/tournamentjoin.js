// commands/tournamentjoin.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentjoin")
    .setDescription("Join the current tournament."),

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

    const userId = interaction.user.id;

    // Determine required team size
    const requiredSize =
      t.gametype === "1v1" ? 1 :
      t.gametype === "2v2" ? 2 :
      t.gametype === "3v3" ? 3 : 1;

    // Check if user is already in a team
    const existingTeam = t.teamsJoined.find(team =>
      team.members.includes(userId)
    );

    if (existingTeam) {
      return interaction.reply({
        content: `You are already in **${existingTeam.name}**.`,
        ephemeral: true,
      });
    }

    // Find a team that is not full
    let team = t.teamsJoined.find(team => team.members.length < requiredSize);

    // If no team exists → create a new one
    if (!team) {
      const teamName = `Team ${String.fromCharCode(65 + t.teamsJoined.length)}`;
      team = {
        name: teamName,
        members: [],
        checkins: [],
      };
      t.teamsJoined.push(team);
    }

    // Add player to team
    team.members.push(userId);

    // Build player list formatting
    const playerLines = team.members.map((id, index) => {
      return `**Player ${index + 1}:** <@${id}>`;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Join`,
        ``,
        `**You joined:** ${team.name}`,
        ``,
        `### Team Members`,
        playerLines,
        ``,
        `Team size: \`${team.members.length}/${requiredSize}\``,
        team.members.length === requiredSize
          ? `✅ Your team is now full!`
          : `⏳ Waiting for more players...`,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
