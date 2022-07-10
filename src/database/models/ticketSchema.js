const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    GuildID: String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
    HasPutReason: Boolean,
    Reason: String,
    Type: String,

});

module.exports = new mongoose.model('Tickets', ticketSchema, 'tickets');