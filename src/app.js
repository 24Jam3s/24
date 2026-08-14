const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

/* ---------------------------
   LOAD SLASH COMMANDS
---------------------------- */
const interactionsPath = path.join(__dirname, 'interactions');
const interactionFiles = fs.readdirSync(interactionsPath).filter(file => file.endsWith('.js'));

for (const file of interactionFiles) {
    const command = require(path.join(interactionsPath, file));
    client.commands.set(command.data.name, command);
}

/* ---------------------------
   LOAD BUTTON HANDLERS
---------------------------- */
const buttonsPath = path.join(__dirname, 'handlers/interactionHandlers/buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const handler = require(path.join(buttonsPath, file));
    client.buttons.set(handler.customId, handler);
}

/* ---------------------------
   LOAD MODAL HANDLERS
---------------------------- */
const modalsPath = path.join(__dirname, 'handlers/interactionHandlers/modals');
const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

for (const file of modalFiles) {
    const handler = require(path.join(modalsPath, file));
    client.modals.set(handler.customId, handler);
}

/* ---------------------------
   INTERACTION HANDLER
---------------------------- */
client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) return command.execute(interaction);
    }

    if (interaction.isButton()) {
        for (const handler of client.buttons.values()) {
            if (handler.customId instanceof RegExp && handler.customId.test(interaction.customId)) {
                return handler.execute(interaction);
            }
            if (handler.customId === interaction.customId) {
                return handler.execute(interaction);
            }
        }
    }

    if (interaction.isModalSubmit()) {
        for (const handler of client.modals.values()) {
            if (handler.customId instanceof RegExp && handler.customId.test(interaction.customId)) {
                return handler.execute(interaction);
            }
            if (handler.customId === interaction.customId) {
                return handler.execute(interaction);
            }
        }
    }
});

client.login(process.env.TOKEN);
