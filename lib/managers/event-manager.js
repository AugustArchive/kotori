const EventProcessor = require('../processors/event-processor');
const { readdir }    = require('fs');

module.exports = class EventManager {
    /**
     * Creates a new instance of the event manager
     * @param {import('../client')} client The client
     * @param {EventManagerOptions} options The options
     */
    constructor(client, options) {
        this.client = client;
        this.options = Object.assign({}, options);
        this.processor = new EventProcessor(client);

        Object.freeze(this.options);
    }

    /**
     * Starts the event process
     */
    start() {
        readdir(this.options.path, (error, files) => {
            if (error) this.client.logger.info(`  Unable to build events:\n${error.stack}`);

            this.client.logger.info(`  Building ${files.length} events...`);
            files.forEach((f) => {
                const Event = require(`${this.options.path}/${f}`);
                const event = new Event(this.client);
                this.processor.process(event);
            });
        });
    }
};

/**
 * @typedef {Object} EventManagerOptions
 * @prop {string} path The path
 */