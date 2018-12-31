module.exports = class SchedulerProcessor {
    /**
     * Construct the SchedulerProcessor processor to process all schedulers
     * 
     * @param {import('../client')} client The CLI- client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Process all schedulers
     * 
     * @param {import('../interfaces/scheduler')} s The scheduler
     */
    async process(s) {
        await s.run();
        setTimeout(async() => await s.run(), s.interval);
    }
};