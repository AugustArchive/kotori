module.exports = class EventProcessor {
    /**
     * Construct the EventProcessor processor to process events
     * 
     * @param {import('../client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Process all of the events
     * 
     * @param {import('../interfaces/event')} event The event to execute
     */
    async process(event) {
        const func = async(...args) => {
            try {
                await event.run(...args);
            } catch(ex) {
                throw ex;
            }
        };

        // insert if statements spaget
        if (event.emitter === 'client')
            this.client.on(event.event, func);
        if (event.emitter === 'commandManager')
            this.client.manager.on(event.event, func);
        if (event.emitter === 'database')
            this.client.database.on(event.event, func);
        if (event.emitter === 'schedulerManager')
            this.client.schedulers.on(event.event, func);
    }
};