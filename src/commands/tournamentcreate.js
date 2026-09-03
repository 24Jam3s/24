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
        .setDescription("Prize for the tournament