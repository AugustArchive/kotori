const { Collection } = require('@maika.xyz/eris-utils');
const CommandContext = require('../interfaces/context');

module.exports = class CommandProcessor {
    /**
     * Create a new CommandProcessor instance
     * @param {import('../client')} client The client
     */
    constructor(client) {
        /**
         * The client instance
         * @type {import('../client')}
         */
        this.client = client;

        /**
         * The ratelimits cache
         * @type {Collection<Collection<number>>}
         */
        this.ratelimits = new Collection();
    }

    /**
     * Processes the `messageCreate` event when it emits
     * @param {import('@augu/eris').Message} msg The message
     */
    async process(msg) {}
};