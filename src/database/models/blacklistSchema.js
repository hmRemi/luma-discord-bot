const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    GuildID: String,
    GuildName: String,
});

module.exports = new mongoose.model('Blacklist', blacklistSchema, 'blacklisted-servers');