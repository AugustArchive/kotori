const ArgumentType = require('../interfaces/type');

module.exports = class ChannelArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'channel');
    }

    async validate(msg, arg, val) {
        const channel = await this.client.rest.getChannel(val, msg.guild);
        return channel.name === val;
    }

    parse(msg, arg, val) {
        const channel = msg.guild.channels.filter(s => s.name === val);
        if (channel.size === 0)
            return false;
        if (channel.size === 1)
            return channel[0];

        return null;
    }
};