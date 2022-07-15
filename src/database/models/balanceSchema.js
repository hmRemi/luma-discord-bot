const mongoose = require ("mongoose");

const balanceSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    GuildID: String,
    UserID: String,
    Wallet: Number,
    Bank: Number,
    lastDaily: Date,
    lastWeekly: Date,
    lastMonthly: Date,
});

module.exports = new mongoose.model('Balance', balanceSchema, 'balances');
