const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: 32767});
const fs = require('fs');

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const moment = require("moment");
require("moment-duration-format");

const { AutoPoster } = require('topgg-autoposter')

const express = require("express");
const app = express();

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    searchSongs: 5,
    customFilters:
    {
        "bassboost": "bass=g=20,dynaudnorm=f=500",
    },
    plugins: [new SpotifyPlugin()]
});

module.exports = client;

const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client); // discord-modals needs your client in order to interact with modals

/**
 * BOT COLLECTIONS
 * Using @Collection to store datatypes and classes.
 */

client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();

/**
 * DASHBOARD CONFIGURATION
 * Using express.
 */

app.enable("trust proxy");
app.set("etag", false);
app.use(express.static(__dirname + "/website"));



require('dotenv').config();

const handlers = fs.readdirSync("./src/handlers").filter(file => file.endsWith(".js"));
const systemsFolder = fs.readdirSync("./src/systems").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events")/*.filter(file => file.endsWith(".js"))*/;
const commandsFolder = fs.readdirSync("./src/commands");
const buttonsFolder = fs.readdirSync("./src/buttons");

(async () => {

    /**
     * Require every file inside of the handlers & systems directory
     * Will revamp later on to a handler.
     */

    for(file of handlers) {
        require(`./handlers/${file}`)(client);
    }

    for(file of systemsFolder) {
        require(`./systems/${file}`)(client);
    }

    /**
     * Register all files.
     */

    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandsFolder, "./src/commands")
    client.handleButtons(buttonsFolder, "./src/buttons")
    client.handleMenus();

    require("./systems/LockdownSystem")(client);
    require("./systems/GiveawaySystem")(client);

    app.use((req, res, next) => {
        // Log every website entry to the console.
        console.log(`- REQUEST: ${req.method} | URL: ${req.url} | CODE: ${res.statusCode} | IP: ${req.ip}`)
        next();
    });
    

    app.get("/", async(req, res) => {
        const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
        const guilds = client.guilds.cache.size;

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        let file = fs.readFileSync("./src/website/index.html", { encoding: "utf8" });
        file = file.replace("$$guilds$$", guilds);
        file = file.replace("$$users$$", users);
        file = file.replace("$$uptime$$", duration);

        res.send(file);
    })
    
    /**
     * Using @AutoPoster to update TOP.GG stats.
     */

    AutoPoster(process.env.topggtoken, client)
      .on('posted', () => {
        console.log('Posted stats to Top.gg!')
      });

    client.login(process.env.token);
    client.dbLogin();

    app.listen(80, () => console.log('App on port 80'));
})();