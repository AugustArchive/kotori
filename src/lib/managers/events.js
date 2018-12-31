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
                if (!(event instanceof Event))
                    throw new RangeError("Event wasn't an instanceof Kotori.Event");

                const e = new event(this.client);
                this.processor.process(e);
            });
        });
    }
};