const { Schema } = require('../../src');

module.exports = class UserSchema extends Schema {
    constructor() {
        super({
            name: 'users',
            definitions: {
                userID: {
                    type: String,
                    default: null
                }
            }
        });
    }
};