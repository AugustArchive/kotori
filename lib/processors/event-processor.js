module.exports = class EventProcessor {
    /**
     * Creates a new instance of the event processor
     * @param {import('../client')} client The client
     */
    constructor(client) {
        /**
         * The client instance
         * @type {import('../client')}
         */
        this.client = client;
    }

    /**
     * Processes the event
     * @param {import('../interfaces/event')} event The event to process
     */
    process(event) {}
};