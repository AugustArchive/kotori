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
    process(event) {
        const func = async(...args) => {
            try {
                await event.emit(...args);
            } catch(ex) {
                this.client.logger.error(`  Unable to run the ${event.event} event:\n${ex.stack}`);
            }
        };

        this.client.on(event.event, func);
    }
};