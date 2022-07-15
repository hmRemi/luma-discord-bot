const Balance = require("../database/models/balanceSchema");
const mongoose = require("mongoose");

module.exports = (client) => {
    client.createBalance = async (user) => {
        const balanceProfile = await Balance.findOne({ UserID: user.id, GuildID: user.guild.id });

        if (!balanceProfile) {
            balanceProfile = await new Balance({
                GuildID: user.guild.id,
                UserID: user.id,
                Wallet: 0,
                Bank: 0,
                lastDaily: new Date(),
                lastWeekly: new Date(),
                lastMonthly: new Date()
            });
            await balanceProfile.save().catch(err => console.log(err));
        }
    };
};