module.exports = class MessageCollector {
    /**
     * Construct a new MessageCollector instance
     * 
     * @param {import('../client')} client The client
     */
    constructor(client) {
        this.collectors = {};
        client.on('messageCreate', this.verifyMessage.bind(this));
    }

    /**
     * Verifies if the message is the collected message that was provided by the filter
     * 
     * @param {import('eris').Message} msg The message
     */
    verifyMessage(msg) {
        // If there wasn't a cached user or the user is a bot
        if (!msg.author || msg.author.bot)
            return;

        const collector = this.collectors[msg.channel.id + msg.author.id];
        if (collector && collector.filter(msg))
            collector.accept(msg);
    }

    /**
     * Awaits an message
     * 
     * @param {(msg: import('eris').Message) => boolean} filter The filter to filter out what the response should be
     * @param {AwaitMessagesOptions} options The options
     * @returns {Promise<import('eris').Message>} The promised message
     */
    awaitMessage(filter, options) {
        const { channelID, userID, timeout } = options;
        return new Promise((accept) => {
            if (this.collectors[channelID + userID])
                delete this.collectors[channelID + userID];

            // Adds the filter function and the accept function
            this.collectors[channelID + userID] = { filter, accept };
            setTimeout(accept.bind(null, false), timeout);
        });
    }
};

/**
 * @typedef {Object} AwaitMessagesOptions
 * @prop {string} channelID The channel ID
 * @prop {string} userID The user ID
 * @prop {number} [timeout=30000] The timeout to wait
 */