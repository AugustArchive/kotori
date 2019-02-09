module.exports = class MessageCollector {
    /**
     * Creates a new message collector instance
     * @param {import('../client')} client The client
     */
    constructor(client) {
        /** @type {{ [x: string]: Collector }} */
        this.collectors = {};
        client.on('messageCreate', this.verify.bind(this));
    }

    /**
     * Verification for awaiting messages
     * @param {import('@augu/eris').Message} msg The message
     */
    verify(msg) {
        if (!msg.author) return;

        const collector = this.collectors[msg.channel.id + msg.author.id];
        if (collector && collector.filter(msg)) collector.accept(msg);
    }

    /**
     * Awaits an message
     * @param {AwaitFunction} filter The filter
     * @param {MessageCollectorOptions} options The options
     * @returns {Promise<import('@augu/eris').Message>} The promised message
     */
    awaitMessage(filter, options) {
        const { channelID, userID } = options;
        const timeout = options.timeout * 1000;
        
        return new Promise((accept) => {
            if (this.collectors[channelID + userID]) delete this.collectors[channelID + userID];

            this.collectors[channelID + userID] = { filter, accept };
            setTimeout(() => accept.bind(null, false), timeout);
        });
    }
};

/**
 * @typedef {Object} Collector
 * @prop {AwaitFunction} filter The filter
 * @prop {AcceptFunction} accept The promise's "resolve" function
 * 
 * @typedef {Object} MessageCollectorOptions
 * @prop {string} channelID The channel ID
 * @prop {string} userID The user ID
 * @prop {number} [interval=30] The interval in seconds
 * 
 * @typedef {(msg: import('@augu/eris').Message) => boolean} AwaitFunction
 * @typedef {(value?: import('@augu/eris').Message | PromiseLike<import('@augu/eris').Message>) => void} AcceptFunction
 */