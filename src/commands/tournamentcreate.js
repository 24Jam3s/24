// commands/tournamentcreate.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("tournamentcreate")
    .setDescription("Create a new tournament.")
    .addStringOption(o =>
      o.setName("matchtype")
        .setDescription("Match type (DL / CL / RL)")
        .setRequired(true)
        .addChoices(
          { name: "DL", value: "DL" },
          { name: "CL", value: "CL" },
          { name: "RL", value: "RL" }
        )
    )
    .addStringOption(o =>
      o.setName("gametype")
        .setDescription("Game type (1v1 / 2v2 / 3v3)")
        .setRequired(true)
        .addChoices(
          { name: "1v1", value: "1v1" },
          { name: "2v2", value: "2v2" },
          { name: "3v3", value: "3v3" }
        )
    )
    .addStringOption(o =>
      o.setName("prize")
        .setDescription("Prize for the tournament")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("rules")
        .setDescription("Rules for the tournament")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("time")
        .setDescription("Start time for the tournament")
        .setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!interaction.client.tournaments) {
      interaction.client.tournaments = {};
    }

    // Prevent overwriting an active tournament
    if (interaction.client.tournaments[guildId]) {
      return interaction.reply({
        content: "A tournament is already active in this server.",
        ephemeral: true,
      });
    }

    const matchtype = interaction.options.getString("matchtype");
    const gametype = interaction.options.getString("gametype");
    const prize = interaction.options.getString("prize");
    const rules = interaction.options.getString("rules");
    const time = interaction.options.getString("time");

    // Determine team size based on game type
    const teamSize =
      gametype === "1v1" ? 1 :
      gametype === "2v2" ? 2 :
      gametype === "3v3" ? 3 : 1;

    // Create tournament object
    interaction.client.tournaments[guildId] = {
      matchtype,
      gametype,
      prize,
      rules,
      time,
      teamSize,
      status: "Created",
      teamsJoined: [],
      matches: [],
      currentRound: 1,
    };

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Created`,
        ``,
        `**Match Type:** ${matchtype}`,
        `**Game Type:** ${gametype} (\`${teamSize}\` players per team)`,
        `**Prize:** ${prize}`,
        `**Rules:** ${rules}`,
        `**Start Time:** ${time}`,
        ``,
        `Players can now join using \`/tournamentjoin\`.`
      ].join("\n"))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  },
};
