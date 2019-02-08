const { model, Schema } = require('@augu/eris');

module.exports = model('suggestions', new Schema({
    guildID: String,
    userID: String,
    messageID: String,
    suggestion: String,
    users: [],
    upvotes: Number,
    downvotes: Number,
    interval: { 
        type: String, 
        default: 900000 
    }
}), 'suggestions');