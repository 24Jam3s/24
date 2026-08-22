import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('scrimjoin')
    .setDescription('Join a scrim hosted by another user.')
    .addUserOption(option =>
      option
        .setName('host')
        .setDescription('The user hosting the scrim you want to join.')
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
        content: 'This scrim has already ended.',
        ephemeral: true
      });
    }

    if (scrim.players.includes(interaction.user.id)) {
      return interaction.reply({
        content: 'You are already in this scrim.',
        ephemeral: true
      });
    }

    if (scrim.players.length >= scrim.playersNeeded) {
      return interaction.reply({
        content: 'This scrim is already full.',
        ephemeral: true
      });
    }

    // ⭐ Add player to scrim
    scrim.players.push(interaction.user.id);

    // ⭐ Add player to thread so they can talk
    await scrim.thread.members.add(interaction.user.id);

    // Update embed
    const playerList =
      `• <@${scrim.host}> *(host)*\n` +
      scrim.players.map(id => `• <@${id}>`).join('\n');

    scrim.embed.setDescription(
      scrim.embed.data.description.replace(
        /\*\*Players Joined:\*\*[\s\S]*/g,
        `**Players Joined:**\n${playerList}`
      )
    );

    await scrim.message.edit({ embeds: [scrim.embed] });

    // ⭐ Auto‑ping host
    await scrim.thread.send(
      `<@${scrim.host}> someone joined your scrim!\n` +
      `**${interaction.user.username}** has joined.`
    );

    return interaction.reply({
      content: 'You have successfully joined the scrim.',
      ephemeral: true
    });
  }
};
