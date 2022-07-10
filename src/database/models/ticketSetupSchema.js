const mongoose = require('mongoose');

const ticketSetupSchema = new mongoose.Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Transcripts: String,
    Handlers: String,
    Everyone: String,
    Description: String,
    Buttons: [String],
});

module.exports = new mongoose.model('TicketSetup', ticketSetupSchema, 'ticketsetup');