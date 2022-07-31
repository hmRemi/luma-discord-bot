const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: 32767});
const fs = require('fs');

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const moment = require("moment");
require("moment-duration-format");

const Topgg = require(`@top-gg/sdk`)
const { AutoPoster } = require('topgg-autoposter')

const api = new Topgg.Api(process.env.topggtoken)

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

// Collections
client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();

app.enable("trust proxy");
app.set("etag", false);
app.use(express.static(__dirname + "/website"));

require('dotenv').config();

const handlers = fs.readdirSync("./src/handlers").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events")/*.filter(file => file.endsWith(".js"))*/;
const commandsFolder = fs.readdirSync("./src/commands");
const buttonsFolder = fs.readdirSync("./src/buttons");

(async () => {

    for(file of handlers) {
        require(`./handlers/${file}`)(client);
    }

    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandsFolder, "./src/commands")
    client.handleButtons(buttonsFolder, "./src/buttons")
    client.handleMenus();

    require("./systems/LockdownSystem")(client);
    require("./systems/GiveawaySystem")(client);

    const https = require('https');
    //const server = https.createServer({ key, cert }, app);

    app.use((req, res, next) => {
        console.log(`- REQUEST: ${req.method} | URL: ${req.url} | CODE: ${res.statusCode} | IP: ${req.ip}`)
        next();
    });
    

    app.get("/", async(req, res) => {
        const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
        const guilds = client.guilds.cache.size;

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        let file = fs.readFileSync("./src/website/html/home.html", { encoding: "utf8" });
        file = file.replace("$$guilds$$", guilds);
        file = file.replace("$$users$$", users);
        file = file.replace("$$uptime$$", duration);

        res.send(file);
    })
    
    AutoPoster(process.env.topggtoken, client)
      .on('posted', () => {
        console.log('Posted stats to Top.gg!')
      });

    client.login(process.env.token);
    client.dbLogin();

    app.listen(80, () => console.log('App on port 80'));
})();

/*
 * REMEMBER TO UPDATE FILES IN VPS AFTER CHANGE
*/