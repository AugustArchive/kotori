const MessageCollector = require('./collector');

module.exports = class CommandMessage {
    /**
     * Construct the CommandMessage interface
     * 
     * @param {import('../client')} client The client
     * @param {import('eris').Message} message The message
     * @param {string[]} args The arguments
     */
    constructor(client, message, args) {
        this.client = client;
        this.message = message;
        this.args = args;
    }

    /**
     * The message collector
     * 
     * @returns {MessageCollector} The new MessageCollector that was created
     */
    get collector() {
        return new MessageCollector(this.client);
    }

    /**
     * Gets the current guild the bot is in
     * 
     * @returns {import('eris').Guild} The guild that Eris cached
     */
    get guild() {
        return this.message.channel.guild;
    }

    /**
     * Gets the sender of the message
     * 
     * @returns {import('eris').User} The user that Eris cached OwO
     */
    get sender() {
        return this.message.author;
    }

    /**
     * Reply with an embed
     * 
     * @param {import('eris').EmbedOptions} content The content to send
     * @returns {PromisedMessage} The promised message
     */
    embed(content) {
        return this.message.channel.createMessage({ embed: content });
    }

    /**
     * Reply as text
     * 
     * @param {string|string[]} content The content to send
     * @returns {PromisedMessage} The promised message
     */
    reply(content) {
        if (content instanceof Array)
            return this.message.channel.createMessage(content.join('\n'));

        return this.message.channel.createMessage(content);
    }
};

/**
 * @typedef {Promise<import('eris').Message>} PromisedMessage
 */