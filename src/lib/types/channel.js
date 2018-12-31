const ArgumentType = require('../interfaces/type');

module.exports = class ChannelArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'channel');
    }

    async validate(msg, arg, val) {
        const channel = await this.client.rest.getChannel(val, msg.guild);
        if (!channel)
            return false;

        return true;
    }

    async parse(msg, arg, val) {
        return await this.client.rest.getChannel(val, msg.guild); 
    }
};