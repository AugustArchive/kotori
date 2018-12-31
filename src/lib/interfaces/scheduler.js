module.exports = class Scheduler {
    /**
     * Construct a new Scheduler interface
     * 
     * @param {import('../client')} client The client
     * @param {SchedulerInfo} info The information
     */
    constructor(client, info) {
        this.client = client;
        this.name = info.name;
        this.interval = info.interval;
    }
};

/**
 * @typedef {Object} SchedulerInfo
 * @prop {string} name The scheduler name
 * @prop {number} interval The number of seconds to run the scheduler
 */