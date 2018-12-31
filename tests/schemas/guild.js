const { Schema } = require('../../src');

module.exports = class GuildSchema extends Schema {
    constructor() {
        super({
            name: 'guilds',
            definitions: {
                guildID: {
                    type: String,
                    default: null
                }
            }
        });
    }
};