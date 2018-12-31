const ArgumentType = require('../interfaces/type');

module.exports = class UserArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'user');
    }

    async validate(msg, arg, val) {
        const user = await this.client.rest.getUser(val);
        if (!user)
            return false;

        return true;
    }

    async parse(msg, arg, val) {
        return await this.client.rest.getUser(val); 
    }
};