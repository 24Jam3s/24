// commands/tournamentcreate.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentcreate')
    .setDescription('Create a new tournament.')
    .addStringOption(o =>
      o.setName('gametype')
        .setDescription('Gametype for the tournament')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('matchtype')
        .setDescription('Match type (e.g. 2v2, 3v3)')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('time')
        .setDescription('Tournament start time')
        .setRequired(true)
    ),

  async execute(interaction) {
    const gametype = interaction.options.getString('gametype');
    const matchtype = interaction.options.getString('matchtype');
    const time = interaction.options.getString('time');

    interaction.client.tournament = {
      gametype,
      matchtype,
      time,
      teams: [],
      matches: [],
      bracket: [],
      currentRound: 1,
      status: 'Waiting'
    };

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 Tournament Created 🏆`,
        ``,
        `**\`\`Gametype\`\`**`,
        `- ${gametype}`,
        ``,
        `**\`\`Matchtype\`\`**`,
        `- ${matchtype}`,
        ``,
        `**\`\`Start Time\`\`**`,
        `- ${time}`,
        ``,
        `Teams may now join the tournament.`
      ].join('\n'))
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
