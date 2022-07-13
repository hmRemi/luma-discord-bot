const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    GuildID: String,
    verificationRoleID: { type: String, required: false },
});

module.exports = new mongoose.model('Verify', verifySchema, 'verify');