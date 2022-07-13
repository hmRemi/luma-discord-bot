const mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
    GuildID: String,
    GuildName: String,
});

module.exports = new mongoose.model('Premium', premiumSchema, 'premiums');