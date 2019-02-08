const { model, Schema } = require('mongoose');

module.exports = model('tags', new Schema({
    userID: String,
    content: String,
    used: Number
}), 'tags');