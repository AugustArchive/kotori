module.exports = class Scheduler {
    /**
     * Construct a new Scheduler interface
     * @param {import('../client')} client The client instance
     * @param {SchedulerOptions} options The additional options to set
     */
    constructor(client, options) {
        this.client   = client;
        this.name     = options.name;
        this.interval = options.interval;
        this.disabled = options.disabled || false;
    }

    /**
     * Runs the scheduler
     */
    async run() {}
}

/**
 * @typedef {Object} SchedulerOptions
 * @prop {string} name The scheduler name
 * @prop {number} interval The amount of milliseconds to run the scheduler
 * @prop {boolean} [disabled=false] If the scheduler shouldn't run
 */