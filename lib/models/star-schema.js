const { model, Schema } = require('mongoose');

module.exports = model('stars', new Schema({
    guildID: String,
    userID: String,
    messageID: String,
    date: Date,
    stars: Number
}), 'stars');