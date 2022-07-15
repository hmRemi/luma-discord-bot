const mongoose = require ("mongoose");

const securitySchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    GuildID: String,

    AntiSpam: { type: [Boolean], default: false },
    AntiSpamCount: { type: [Number], default: 5 },
    AntiSpamTime: { type: [Number], default: 300 },
    AntiSpamMessage: { type: [String], default: "Please refrain from spamming to prevent further punishments." },

    AntiSpamTimeout: { type: [Boolean], default: false },
    AntiSpamTimeoutTime: { type: [Number], default: 300 },
    AntiSpamTimeoutMessage: { type: [String], default: "You've been timed out for spamming!" },

    AntiSpamKick: { type: [Boolean], default: false },
    AntiSpamKickMessage: { type: [String], default: "You've been kicked from the server!" },
});

module.exports = new mongoose.model('Security', securitySchema, 'security-settings');
