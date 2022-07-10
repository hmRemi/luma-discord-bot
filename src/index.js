const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});
const fs = require('fs');

const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client); // discord-modals needs your client in order to interact with modals

client.commands = new Collection();
client.buttons = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandsFolder = fs.readdirSync("./src/commands");
const buttonsFolder = fs.readdirSync("./src/buttons");

(async () => {

    for(file of functions) {
        require(`./functions/${file}`)(client);
    }

    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandsFolder, "./src/commands")
    client.handleButtons(buttonsFolder, "./src/buttons")

    client.login(process.env.token);
    client.dbLogin();
    require("./systems/LockdownSystem")(client)
})();
