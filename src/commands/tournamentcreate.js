// commands/tournamentcreate.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentcreate')
    .setDescription('Create a new tournament.')
    .addStringOption(o =>
      o.setName('matchtype')
        .setDescription('DL / CL / RL')
        .setRequired(true)
        .addChoices(
          { name: 'DL', value: 'DL' },
          { name: 'CL', value: 'CL' },
          { name: 'RL', value: 'RL' }
        )
    )
    .addStringOption(o =>
      o.setName('gametype')
        .setDescription('2v2 / 3v3 / 1v1')
        .setRequired(true)
        .addChoices(
          { name: '2v2', value: '2v2' },
          { name: '3v3', value: '3v3' },
          { name: '1v1', value: '1v1' }
        )
    )
    .addStringOption(o =>
      o.setName('prize')
        .setDescription('Prize for the tournament')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('time')
        .setDescription('Tournament start time (text)')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('teams')
        .setDescription('8 Teams / 16 Teams / 32 Teams')
        .setRequired(true)
        .addChoices(
          { name: '8 Teams', value: '8 Teams' },
          { name: '16 Teams', value: '16 Teams' },
          { name: '32 Teams', value: '32 Teams' }
        )
    )
    .addStringOption(o =>
      o.setName('maps')
        .setDescription('Any / RCL / Legacy')
        .setRequired(true)
        .addChoices(
          { name: 'Any', value: 'Any' },
          { name: 'RCL', value: 'RCL' },
          { name: 'Legacy', value: 'Legacy' }
        )
    )
    .addStringOption(o =>
      o.setName('rules')
        .setDescription('Comma-separated rules (e.g. No cheating, No camo avatars)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const matchtype = interaction.options.getString('matchtype');
    const gametype = interaction.options.getString('gametype');
    const prize = interaction.options.getString('prize');
    const time = interaction.options.getString('time');
    const teams = interaction.options.getString('teams');
    const maps = interaction.options.getString('maps');
    const rulesRaw = interaction.options.getString('rules');

    // Convert comma-separated rules → "- rule" lines
    const rulesList = rulesRaw
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => `- ${r}`)
      .join('\n');

    // Store tournament data
    interaction.client.tournament = {
      matchtype,
      gametype,
      prize,
      time,
      teams,
      maps,
      rules: rulesList,
      status: 'Waiting',
      teamsJoined: [],
      bracket: [],
      matches: [],
      currentRound: 1
    };

    const embed = new EmbedBuilder()
      .setDescription([
        `<@&1512466280618393682>`,
        `# 🏆 ${matchtype} ${gametype} Tournament! 🏆`,
        ``,
        `**\`\`Prize\`\`**`,
        `- ${prize}`,
        ``,
        `**\`\`Information\`\`**`,
        `- ${time}`,
        `- Maximum ${teams}`,
        `- ${maps}`,
        ``,
        `**\`\`Rules\`\`**`,
        `${rulesList}`,
        ``,
        `**Use: \`\`/tournamentjoin\`\` To enter the tournament`,
        `Use \`\`/checkin\`\` To confirm your entry (Only use 1hr before tournament!)**`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
