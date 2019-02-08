const { model, Schema } = require('mongoose');

module.exports = model('guilds', new Schema({
    guildID: String,
    prefix: String,
    reddit: {
        enabled: {
            type: Boolean,
            default: false
        },
        channelID: {
            type: String,
            default: null
        }
    },
    starboard: {
        threshold: {
            type: Number,
            default: 1
        },
        enabled: {
            type: Boolean,
            default: false
        },
        channelID: {
            type: String,
            default: null
        },
        emoji: {
            type: String,
            default: '⭐'
        }
    },
    modlog: {
        enabled: {
            type: Boolean,
            default: false
        },
        channelID: {
            type: String,
            default: null
        }
    },
    suggestions: {
        enabled: {
            type: Boolean,
            default: false
        },
        channelID: {
            type: Boolean,
            default: false
        },
        upvote: {
            emoji: {
                type: String,
                default: '✅'
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        downvote: {
            emoji: {
                type: String,
                default: '❌'
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    },
    tags: [],
    assignable: [],
    autoroles: [],
    blacklist: {
        is: {
            type: Boolean,
            default: false
        },
        reason: {
            type: String,
            default: 'No reason specified'
        }
    }
}), 'guilds');