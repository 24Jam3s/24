import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('scrimjoin')
    .setDescription('Join a host\'s scrim.')
    .addUserOption(o =>
      o.setName('host')
        .setDescription('Host of the scrim you want to join.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const host = interaction.options.getUser('host');
    const scrim = interaction.client.scrims?.get(host.id);

    if (!scrim) {
      return interaction.reply({
        content: 'That user does not have an active scrim.',
        ephemeral: true
      });
    }

    if (!scrim.active) {
      return interaction.reply({
        content: 'This game has ended.',
        ephemeral: true
      });
    }

    if (scrim.players.length >= scrim.playersNeeded) {
      return interaction.reply({
        content: 'This game is already full.',
        ephemeral: true
      });
    }

    if (scrim.players.includes(interaction.user.id)) {
      return interaction.reply({
        content: 'You already joined this scrim.',
        ephemeral: true
      });
    }

    scrim.players.push(interaction.user.id);

    const playerList = scrim.players.map(id => `• <@${id}>`).join('\n');

    scrim.embed.setDescription(
      scrim.embed.data.description.replace(
        /\*\*Players Joined:\*\*[\s\S]*/g,
        `**Players Joined:**\n${playerList}`
      )
    );

    await scrim.message.edit({ embeds: [scrim.embed] });

    await scrim.thread.send(
      `**${interaction.user.username}** joined the scrim.`
    );

    await interaction.reply({
      content: 'You have joined the scrim!',
      ephemeral: true
    });
  }
};
