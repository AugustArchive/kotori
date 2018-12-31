const ArgumentType = require('../interfaces/type');

module.exports = class EmojiArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'emoji');
    }

    async validate(msg, arg, val) {
        const emoji = msg.guild.emojis.filter(s => s.name === val.toLowerCase());
        if (emoji[0])
            return true;
        if (!emoji)
            return false;

        return emoji.length > 15 ? `Multiple emojis found; be more specific: ${emojis.map(s => s.name).join(', ')}` : 'Multiple emojis found; be more specific.';
    }

    parse(msg, arg, val) {
        return msg.guild.emojis.filter(s => s.name === val.toLowerCase())[0];
    }
};