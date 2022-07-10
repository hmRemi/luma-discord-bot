const mongoose = require('mongoose');

const lockdownSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String,
    Time: String,
});

module.exports = new mongoose.model('Lockdown', lockdownSchema, 'lockdowns');