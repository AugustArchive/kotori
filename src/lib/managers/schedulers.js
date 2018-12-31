const { readdir } = require('fs');
const { EventEmitter } = require('events');
const SchedulerProcessor = require('../processors/schedulers');
const { Collection } = require('@maika.xyz/eris-utils');
const Scheduler = require('../interfaces/scheduler');

module.exports = class SchedulerManager extends EventEmitter {
    /**
     * Construct the SchedulerManager instance
     * 
     * @param {import('../client')} client The client
     */
    constructor(client) {
        super();

        this.client = client;
        this.processor = new SchedulerProcessor(client);

        /**
         * @type {Collection<string, import('../interfaces/scheduler')>}
         */
        this.tasks = new Collection();
    }

    async start() {
        readdir(this.client.paths.schedulers, (error, files) => {
            if (error)
                this.emit('schedulers:error', error);

            files.forEach(f => {
                const scheduler = require(`${this.client.paths.schedulers}/${f}`);

                const s = new scheduler(this.client);
                this.registerScheduler(s);
            });
        });
    }

    /**
     * Registers the scheduler
     * 
     * @param {Scheduler} s The scheduler to register
     * @returns {void} nOOOOOOOOOOOOOOOOOOOOOOOOp
     */
    registerScheduler(s) {
        if (this.tasks.has(s))
            this.emit('scheduler:register:error', `Scheduler ${s.name} wasn't able to be registered: Scheduler was already added to the Collection`);

        this.tasks.set(s.name, s);
    }
};