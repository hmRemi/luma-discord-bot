const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageAttachment
} = require('discord.js')

const rp = require("request-promise-native");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nsfw')
        .setDescription('for the horny guys')
        .addStringOption((option) =>
            option
            .setName('options')
            .setDescription('Select an option.')
            .setRequired(true)
            .addChoices(
                {
                    name: "ass",
                    value: "ass"
                }, {
                    name: "boobs",
                    value: "boobs"
                }, {
                    name: "pussy",
                    value: "pussy"
                }, 
                {
                    name: "4k",
                    value: "4k"
                }, 
                {
                    name: "anal",
                    value: "anal"
                }, 
                {
                    name: "cum",
                    value: "cum"
                }, 
            ),
        ),
    nsfw: true,
    async execute(interaction) {

        const Embed = new MessageEmbed()
            .setAuthor("Porn Manager", "https://media.discordapp.net/attachments/895632161057669180/964145767340204042/purchase_premium.png")
            .setColor(`#2f3136`)

        switch (interaction.options.getString("options")) {
            case "ass":
                return rp
                    .get("http://api.obutts.ru/butts/0/1/random")
                    .then(JSON.parse)
                    .then(function (res) {
                        return rp.get({
                            url: "http://media.obutts.ru/" + res[0].preview,
                            encoding: null,
                        });
                    })
                    .then(function (res) {
                        const file = new MessageAttachment(res, "ass.png");

                        interaction.reply({
                            embeds: [Embed.setTitle(":smirk: Ass").setImage("attachment://ass.png")],
                            files: [file]
                        });
                    })
                    .catch((err) => {
                        return console.log(err);
                    });
            case "boobs":
                return rp
                .get("http://api.oboobs.ru/boobs/0/1/random")
                .then(JSON.parse)
                .then(function (res) {
                    return rp.get({
                        url: "http://media.oboobs.ru/" + res[0].preview,
                        encoding: null,
                    });
                })
                .then(function (res) {
                    const file = new MessageAttachment(res, "boobs.png");

                    interaction.reply({
                        embeds: [Embed.setTitle(":smirk: Boobs").setImage("attachment://boobs.png")],
                        files: [file]
                    });
                })
                .catch((err) => {
                    return console.log(err);
                });
            case "pussy":
                const response_pussy = await fetch("http://api.nekos.fun:8080/api/pussy");
                const body_pussy = await response_pussy.json();
                return interaction.reply({
                    embeds: [Embed.setTitle(":smirk: Pussy").setImage(body_pussy.image)],
                });
            case "4k":
                const response_4k = await fetch("http://api.nekos.fun:8080/api/4k");
                const body_4k = await response_4k.json();
                return interaction.reply({
                    embeds: [Embed.setTitle(":smirk: 4k").setImage(body_4k.image)],
            });
            case "anal":
                const response_anal = await fetch("http://api.nekos.fun:8080/api/anal");
                const body_anal = await response_anal.json();
                return interaction.reply({
                    embeds: [Embed.setTitle(":smirk: Anal").setImage(body_anal.image)],
            });
            case "cum":
                const response_cum = await fetch("http://api.nekos.fun:8080/api/cum");
                const body_cum = await response_cum.json();
                return interaction.reply({
                    embeds: [Embed.setTitle(":smirk: Cum").setImage(body_cum.image)],
            });
        }
    }
}