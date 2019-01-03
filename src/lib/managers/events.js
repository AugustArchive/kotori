const { readdir } = require('fs');
const EventProcessor = require('../processors/events');
const Event = require('../interfaces/event');

module.exports = class EventManager {
    /**
     * Construct a new EventManager instance
     * 
     * @param {import('../client')} client The client
     */
    constructor(client) {
        this.client = client;
        this.processor = new EventProcessor(client);
    }

    async start() {
        readdir(this.client.paths.events, (error, files) => {
            if (error)
                throw error;

            files.forEach(f => {
                const event = require(`${this.client.paths.events}/${f}`);

                if (typeof event === 'function')
                    event = new event(this.client);

                if (typeof event.default === 'function')
                    event = new event.default(this.client);

                if (!(event instanceof Event))
                    throw new SyntaxError("Event was unable to be registered; not an instance of Kotori.Event");

                this.processor.process(event);
            });
        });
    }
};