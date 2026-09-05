// commands/tournamentcreate.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentcreate")
    .setDescription("Create a new tournament.")
    .addStringOption(o =>
      o.setName("gametype")
        .setDescription("DL / CL / RL")
        .setRequired(true)
        .addChoices(
          { name: "DL", value: "DL" },
          { name: "CL", value: "CL" },
          { name: "RL", value: "RL" }
        )
    )
    .addStringOption(o =>
      o.setName("matchtype")
        .setDescription("1s / 2s / 3s")
        .setRequired(true)
        .addChoices(
          { name: "1s", value: "1s" },
          { name: "2s", value: "2s" },
          { name: "3s", value: "3s" }
        )
    )
    .addStringOption(o =>
      o.setName("prize")
        .setDescription("Prize for the tournament")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("time")
        .setDescription("Ping the time role")
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("teams")
        .setDescription("Team limit (8 / 16 / 32)")
        .setRequired(true)
        .addChoices(
          { name: "8 Teams", value: 8 },
          { name: "16 Teams", value: 16 },
          { name: "32 Teams", value: 32 }
        )
    )
    .addStringOption(o =>
      o.setName("maps")
        .setDescription("Any / Legacy / RCL")
        .setRequired(true)
        .addChoices(
          { name: "Any", value: "Any" },
          { name: "Legacy", value: "Legacy" },
          { name: "RCL", value: "RCL" }
        )
    )
    .addStringOption(o =>
      o.setName("rules")
        .setDescription("Rules separated by commas")
        .setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!interaction.client.tournaments) {
      interaction.client.tournaments = {};
    }

    if (interaction.client.tournaments[guildId]) {
      return interaction.reply({
        content: "A tournament is already active.",
        ephemeral: true,
      });
    }

    const gametype = interaction.options.getString("gametype");
    const matchtype = interaction.options.getString("matchtype");
    const prize = interaction.options.getString("prize");
    const time = interaction.options.getString("time");
    const teams = interaction.options.getInteger("teams");
    const maps = interaction.options.getString("maps");
    const rulesRaw = interaction.options.getString("rules");

    // Convert rules into bullet points
    const rulesList = rulesRaw
      .split(",")
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => `- ${r}`)
      .join("\n");

    // Determine team size from matchtype
    const teamSize =
      matchtype === "1s" ? 1 :
      matchtype === "2s" ? 2 :
      matchtype === "3s" ? 3 : 1;

    // Store tournament
    interaction.client.tournaments[guildId] = {
      gametype,
      matchtype,
      prize,
      time,
      teams,
      maps,
      rules: rulesList,
      teamSize,
      status: "Created",
      teamsJoined: [],
      matches: [],
      currentRound: 1,
    };

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 ${gametype} ${matchtype} Tournament! 🏆`,
        ``,
        `**\`\`Prize\`\`:**`,
        `- ${prize}`,
        ``,
        `**\`\`Information\`\`:**`,
        `- ${time}`,
        `- Maximum **${teams} Teams**`,
        `- Maps: **${maps}**`,
        ``,
        `**\`\`Rules\`\`:** <@&1512466280618393682>`,
        `${rulesList}`,
        ``,
        `**Use:** \`\`/tournamentjoin\`\` to enter the tournament`,
        `**Use:** \`\`/checkin\`\` to confirm your entry (Only use 1hr before tournament!)`,
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
