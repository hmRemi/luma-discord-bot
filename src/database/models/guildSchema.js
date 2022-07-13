const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    guildID: String,
    guildName: String,
});

module.exports = new mongoose.model('Guild', guildSchema, 'guilds');