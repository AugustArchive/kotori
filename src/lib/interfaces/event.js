module.exports = class Event {
    /**
     * The event interface
     * 
     * @param {import('../client')} client The client
     * @param {EventInfo} info The event info
     */
    constructor(client, info) {
        this.client = client;
        this.event = info.event;
        this.emitter = info.emitter;
    }

    /**
     * Run the event
     * 
     * @param {any[]} args The arguments
     */
    async run(...args) {
        throw new SyntaxError(`Event "${this.event}" needs a run(...args: any[]) to be runnable.`);
    }
};

/**
 * @typedef {Object} EventInfo
 * @prop {string} event The event to run
 * @prop {"client" | "commandManager" | "schedulerManager" | "database"} emitter The emitter to run from
 */