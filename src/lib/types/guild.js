const ArgumentType = require('../interfaces/type');

module.exports = class GuildArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'guild');
    }

    async validate(msg, arg, val) {
        const guild = await this.client.rest.getGuild(val);
        if (!guild)
            return false;

        return true;
    }

    async parse(msg, arg, val) {
        return await this.client.rest.getGuild(val); 
    }
};