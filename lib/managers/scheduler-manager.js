const { Collection } = require('@maika.xyz/eris-utils');
const { readdir }    = require('fs');

module.exports = class SchedulerManager {
    /**
     * Construct a new scheduler manager instance
     * @param {import('../client')} client The client
     * @param {SchedulerManagerOptions} options The options
     */
    constructor(client, options) {
        this.client = client;
        this.options = Object.assign({}, options);
        /** @type {Collection<import('../interfaces/scheduler')>} */
        this.tasks = new Collection();

        Object.freeze(this.options);
    }

    /**
     * Starts the scheduler process
     */
    start() {
        readdir(this.options.path, (error, files) => {
            if (error) this.client.logger.error(`  Unable to build schedulers:\n${error}`);

            this.client.logger.info(`  Building ${files.length} schedulers...`);
            files.forEach(f => {
                const Scheduler = require(`${this.options.path}/${f}`);
                const task = new Scheduler(this.client);
                this.tasks.set(task.name, task);
                this.client.logger.info(`  Successfully initialized the ${task.name} scheduler.`);
            });
        });
    }
};

/**
 * @typedef {Object} SchedulerManagerOptions
 * @prop {string} path The path
 */