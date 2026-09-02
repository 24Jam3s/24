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
        .setDescription('1v1 / 2v2 / 3v3')
        .setRequired(true)
        .addChoices(
          { name: '1v1', value: '1v1' },
          { name: '2v2', value: '2v2' },
          { name: '3v3', value: '3v3' }
        )
    )
    .addStringOption(o =>
      o.setName('prize')
        .setDescription('Prize for the tournament')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('time')
        .setDescription('Tournament start time')
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
        .setDescription('Comma-separated rules')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.client.tournaments) {
      interaction.client.tournaments = {};
    }

    const guildId = interaction.guild.id;

    const matchtype = interaction.options.getString('matchtype');
    const gametype = interaction.options.getString('gametype');
    const prize = interaction.options.getString('prize');
    const time = interaction.options.getString('time');
    const teams = interaction.options.getString('teams');
    const maps = interaction.options.getString('maps');
    const rulesRaw = interaction.options.getString('rules');

    const rulesList = rulesRaw
      .split(',')
      .map(r => `- ${r.trim()}`)
      .join('\n');

    interaction.client.tournaments[guildId] = {
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
        `**Prize**`,
        `- ${prize}`,
        ``,
        `**Information**`,
        `- ${time}`,
        `- Maximum ${teams}`,
        `- ${maps}`,
        ``,
        `**Rules**`,
        `${rulesList}`,
        ``,
        `Use \`\`/tournamentjoin\`\` to enter the tournament.`,
        `Use \`\`/checkin\`\` 1 hour before the tournament.`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
