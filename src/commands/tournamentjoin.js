// commands/tournamentjoin.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentjoin")
    .setDescription("Join the tournament as a full team.")
    .addStringOption(o =>
      o.setName("player1")
        .setDescription("Player 1 (mention or name)")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("player2")
        .setDescription("Player 2 (mention or name)")
        .setRequired(false)
    )
    .addStringOption(o =>
      o.setName("player3")
        .setDescription("Player 3 (mention or name)")
        .setRequired(false)
    ),

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

    // Determine required team size
    const requiredSize =
      t.gametype === "1v1" ? 1 :
      t.gametype === "2v2" ? 2 :
      t.gametype === "3v3" ? 3 : 1;

    // Collect players from command
    const players = [];
    const p1 = interaction.options.getString("player1");
    const p2 = interaction.options.getString("player2");
    const p3 = interaction.options.getString("player3");

    players.push(p1);
    if (p2) players.push(p2);
    if (p3) players.push(p3);

    // Enforce correct team size
    if (players.length !== requiredSize) {
      return interaction.reply({
        content: `This tournament requires **${requiredSize} players per team**.\nYou entered **${players.length}**.`,
        ephemeral: true,
      });
    }

    // Create team name
    const teamName = `Team ${String.fromCharCode(65 + t.teamsJoined.length)}`;

    // Store team
    t.teamsJoined.push({
      name: teamName,
      members: players,
      checkins: [],
    });

    // Build player list formatting
    const playerLines = players
      .map((p, i) => `**Player ${i + 1}:** ${p}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Join`,
        ``,
        `**Team Created:** ${teamName}`,
        ``,
        `### Team Members`,
        playerLines,
        ``,
        `Team size: \`${players.length}/${requiredSize}\``,
        `Your team has successfully joined the tournament!`,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
