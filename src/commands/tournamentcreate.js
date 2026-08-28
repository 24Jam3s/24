// commands/tournamentcreate.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tournamentcreate')
    .setDescription('Create a new tournament.')
    .addStringOption(o =>
      o.setName('gametype')
        .setDescription('DL / CL / RL')
        .setRequired(true)
        .addChoices(
          { name: 'DL', value: 'DL' },
          { name: 'CL', value: 'CL' },
          { name: 'RL', value: 'RL' }
        )
    )
    .addStringOption(o =>
      o.setName('matchtype')
        .setDescription('1s / 2s / 3s')
        .setRequired(true)
        .addChoices(
          { name: '1s', value: '1s' },
          { name: '2s', value: '2s' },
          { name: '3s', value: '3s' }
        )
    )
    .addStringOption(o =>
      o.setName('prize')
        .setDescription('Prize for the tournament')
        .setRequired(true)
    )
    .addMentionableOption(o =>
      o.setName('time')
        .setDescription('Ping the time role')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('teams')
        .setDescription('Maximum teams (8 / 16 / 32)')
        .setRequired(true)
        .addChoices(
          { name: '8', value: 8 },
          { name: '16', value: 16 },
          { name: '32', value: 32 }
        )
    )
    .addStringOption(o =>
      o.setName('maps')
        .setDescription('Any / Legacy / RCL')
        .setRequired(true)
        .addChoices(
          { name: 'Any', value: 'Any' },
          { name: 'Legacy', value: 'Legacy' },
          { name: 'RCL', value: 'RCL' }
        )
    )
    .addStringOption(o =>
      o.setName('rules')
        .setDescription('Comma-separated rules (e.g. No cheating, No camo avatars)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const gametype = interaction.options.getString('gametype');
    const matchtype = interaction.options.getString('matchtype');
    const prize = interaction.options.getString('prize');
    const time = interaction.options.getMentionable('time');
    const teams = interaction.options.getInteger('teams');
    const maps = interaction.options.getString('maps');
    const rulesRaw = interaction.options.getString('rules');

    // Convert comma-separated rules → list with "- "
    const rulesList = rulesRaw
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => `- ${r}`)
      .join('\n');

    interaction.client.tournament = {
      gametype,
      matchtype,
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
        `# 🏆 ${gametype} ${matchtype} Tournament! 🏆`,
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
      .setColor(0xffd700);

    return interaction.reply({ embeds: [embed] });
  }
};
