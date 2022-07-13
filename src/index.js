const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: 32767});
const fs = require('fs');

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const moment = require("moment");
require("moment-duration-format");

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
    require("./systems/LockdownSystem")(client)

    app.use((req, res, next) => {
        console.log(`- ${req.method}: ${req.url} ${res.statusCode} ( by: ${req.ip})`)
        next();
    });

    app.get("/", async(req, res) => {
        const users = client.users.cache.size;
        const guilds = client.guilds.cache.size;

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        let file = fs.readFileSync("./src/website/html/home.html", { encoding: "utf8" });
        file = file.replace("$$guilds$$", guilds);
        file = file.replace("$$users$$", users);
        file = file.replace("$$uptime$$", duration);

        res.send(file);
    })

    client.login(process.env.token);
    client.dbLogin();

    app.listen(80, () => console.log('App on port 80'));
})();
