const mongoose = require('mongoose');

const gtnSchema = new mongoose.Schema({
    GuildID: String,
    Channel: String,
    Number: Number,
});

module.exports = new mongoose.model('GTN', gtnSchema, 'gtns');