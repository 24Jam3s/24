// commands/checkin.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('checkin')
    .setDescription('Check in for the tournament.'),

  async execute(interaction) {

    // Ensure tournaments object exists
    if (!interaction.client.tournaments) {
      interaction.client.tournaments = {};
    }

    const guildId = interaction.guild.id;
    const t = interaction.client.tournaments[guildId];

    if (!t) {
      return interaction.reply({
        content: 'No tournament has been created yet.',
        ephemeral: true
      });
    }

    if (t.status === 'Started') {
      return interaction.reply({
        content: 'The tournament has already started. Check-in is closed.',
        ephemeral: true
      });
    }

    const userId = interaction.user.id;

    // Determine required team size
    const requiredSize =
      t.gametype === '1v1' ? 1 :
      t.gametype === '2v2' ? 2 :
      t.gametype === '3v3' ? 3 : 1;

    // Find the player's team
    const team = t.teamsJoined.find(team => team.members.includes(userId));

    if (!team) {
      return interaction.reply({
        content: 'You are not in a tournament team.',
        ephemeral: true
      });
    }

    // Create check-in list if missing
    if (!team.checkins) {
      team.checkins = [];
    }

    // Prevent double check-in
    if (team.checkins.includes(userId)) {
      return interaction.reply({
        content: 'You have already checked in.',
        ephemeral: true
      });
    }

    // Add player to check-in list
    team.checkins.push(userId);

    const teamIsReady = team.checkins.length === requiredSize;

    const embed = new EmbedBuilder()
      .setDescription([
        `# 🏆 Tournament Check-In 🏆`,
        ``,
        `**Team:**`,
        `- ${team.name}`,
        ``,
        `**Player Checked In:**`,
        `- <@${userId}>`,
        ``,
        `Check-in progress: \`${team.checkins.length}/${requiredSize}\``,
        ``,
        teamIsReady
          ? `Your team is now **fully checked in** and ready for the tournament!`
          : `Waiting for the rest of your team to check in...`
      ].join('\n'))
      .setColor(0x0066FF);

    return interaction.reply({ embeds: [embed] });
  }
};
