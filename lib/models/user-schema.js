const { model, Schema } = require('mongoose');

module.exports = model('users', new Schema({
    userID: String,
    locale: {
        type: String,
        default: 'en-US'
    },
    coins: {
        type: Number,
        default: 0
    },
    profile: {
        badge: {
            type: String,
            default: ':heart: **User**'
        },
        description: {
            type: String,
            default: 'Use **`{{prefix}}{{command}}`** to set a description.'
        }
    }
}), 'users');