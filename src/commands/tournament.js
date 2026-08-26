import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentcreate')
    .setDescription('Create a new tournament.')
    .addStringOption(o =>
      o.setName('matchtype')
        .setDescription('DL, CL, or RL')
        .setRequired(true)
        .addChoices(
          { name: 'DL', value: 'DL' },
          { name: 'CL', value: 'CL' },
          { name: 'RL', value: 'RL' }
        )
    )
    .addStringOption(o =>
      o.setName('gametype')
        .setDescription('1v1, 2v2, or 3v3')
        .setRequired(true)
        .addChoices(
          { name: '1v1', value: '1v1' },
          { name: '2v2', value: '2v2' },
          { name: '3v3', value: '3v3' }
        )
    )
    .addStringOption(o =>
      o.setName('rules')
        .setDescription('Comma-separated list of rules')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('prize')
        .setDescription('Prize for the tournament')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('time')
        .setDescription('Discord timestamp (e.g., <t:1720000000:F>)')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('teams')
        .setDescription('Number of teams')
        .setRequired(true)
        .addChoices(
          { name: '8 Teams', value: '8 Teams' },
          { name: '16 Teams', value: '16 Teams' }
        )
    )
    .addStringOption(o =>
      o.setName('maps')
        .setDescription('Map selection')
        .setRequired(true)
        .addChoices(
          { name: 'Any', value: 'Any' },
          { name: 'Legacy', value: 'Legacy' }
        )
    ),

  async execute(interaction) {
    if (!interaction.memberPermissions.has('Administrator')) {
      return interaction.reply({ content: 'Only admins can create tournaments.', ephemeral: true });
    }

    const matchtype = interaction.options.getString('matchtype');
    const gametype = interaction.options.getString('gametype');
    const rulesRaw = interaction.options.getString('rules');
    const prize = interaction.options.getString('prize');
    const time = interaction.options.getString('time');
    const teams = interaction.options.getString('teams');
    const maps = interaction.options.getString('maps');

    // Format rules into bullet points
    const rulesList = rulesRaw
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => `- ${r}`)
      .join('\n');

    interaction.client.tournament = {
      matchtype,
      gametype,
      rules: rulesList,
      prize,
      time,
      teams,
      maps,
      started: false,
      finished: false,
      entrants: [],
      bracket: [],
      reports: []
    };

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆${gametype} ${matchtype} Tournament! 🏆`,
        ``,
        `**Prize:**`,
        `- ${prize}`,
        ``,
        `**Information:**`,
        `- ${time}`,
        `- Maximum ${teams}`,
        `- ${maps}`,
        ``,
        `**Rules:**`,
        `${rulesList}`,
        ``,
        `**Use: \`/tournamentjoin\` To enter the tournament`,
        `Use \`/checkin\` To confirm your entry (Only use 1hr before tournament!)**`
      ].join('\n'))
      .setColor(0x3498db);

    return interaction.reply({ embeds: [embed] });
  }
};
