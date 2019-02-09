const MessageCollector = require('./collector');
const ArgumentParser = require('./argument-parser');

module.exports = class CommandContext {
    /**
     * Creates a new instance of the command context interface
     * @param {import('../client')} client The client
     * @param {import('@augu/eris').Message} msg The message
     * @param {string[]} args The arguments
     */
    constructor(client, msg, args) {
        Object.assign(this, msg);

        this.client = client;
        this.message = msg;
        this.args = new ArgumentParser(args);
    }

    /**
     * Gets the collector
     * @returns {MessageCollector} The collector instance
     */
    get collector() {
        return new MessageCollector(this.client);
    }

    /**
     * Sends a message to a channel
     * @param {string} content The content to send
     * @returns {PromisedMessage} The message
     */
    async send(content) {
        return this.message.channel.createMessage(content);
    }

    /**
     * Sends a discord embed to a channel
     * @param {import('@augu/eris').Embed} content The content to send
     * @returns {PromisedMessage} The promised message
     */
    async embed(content) {
        return this.message.channel.createMessage({ embed: content });
    }
};

/**
 * @typedef {Promise<import('@augu/eris').Message>} PromisedMessage
 */