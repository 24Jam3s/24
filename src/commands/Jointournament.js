import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('jointournament')
    .setDescription('Join the active tournament.'),

  async execute(interaction) {
    const tournament = interaction.client.tournament;

    if (!tournament) {
      return interaction.reply({
        content: 'There is no active tournament.',
        ephemeral: true
      });
    }

    const channel = interaction.client.channels.cache.get('1515337018253512745');

    await interaction.reply({
      content: `Please answer the questions in <#1515337018253512745>.`,
      ephemeral: true
    });

    await channel.send(
      `**${interaction.user.username}**, enter your Roblox user:`
    );

    const collector = channel.createMessageCollector({
      filter: m => m.author.id === interaction.user.id,
      max: 3,
      time: 60000
    });

    let step = 0;
    let user = '';
    let teammate1 = '';
    let teammate2 = '';

    collector.on('collect', async msg => {
      if (step === 0) {
        user = msg.content;
        if (tournament.type === '1v1') {
          collector.stop('done');
        } else {
          step++;
          await channel.send('Enter teammate 1 username:');
        }
      } else if (step === 1) {
        teammate1 = msg.content;
        if (tournament.type === '2v2') {
          collector.stop('done');
        } else {
          step++;
          await channel.send('Enter teammate 2 username:');
        }
      } else if (step === 2) {
        teammate2 = msg.content;
        collector.stop('done');
      }
    });

    collector.on('end', async (_, reason) => {
      if (reason !== 'done') {
        return channel.send('⛔ Time expired. Please run /jointournament again.');
      }

      const team = {
        leader: interaction.user.id,
        user,
        teammate1: teammate1 || null,
        teammate2: teammate2 || null
      };

      tournament.teams.push(team);

      await channel.send(
        `✅ **Team Registered!**\n` +
        `• Leader: <@${interaction.user.id}>\n` +
        `• User: ${user}\n` +
        (teammate1 ? `• Teammate 1: ${teammate1}\n` : '') +
        (teammate2 ? `• Teammate 2: ${teammate2}\n` : '')
      );
    });
  }
};
