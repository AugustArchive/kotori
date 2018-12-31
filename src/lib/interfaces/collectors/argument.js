const Argument = require('../argument');

module.exports = class ArgumentCollector {
    /**
     * Create a new Argument collector instance
     * 
     * @param {import('../../client')} client The client
     * @param {Argument[]} args The arguments provided
     * @param {number} [limit=Infinity] The limit
     */
    constructor(client, args, limit = Infinity) {
        /**
         * The client
         * @type {import('../../client')}
         */
        this.client = client;

        if (!Array.isArray(args))
            throw new RangeError("ArgumentCollector#args must be an instance of: Array<String> | String[]");

        /**
         * The arguments
         * @type {Argument[]}
         */
        this.args = new Array(args.length);

        let infinite = false;
        let optional = false;
        for (let i = 0; i < args.length; i++) {
            if (infinite)
                throw new Error("Can't use any other argument after an infinite argument.");
            if (args[i].default !== null)
                optional = true;
            if (optional)
                throw new Error("Unable to use required arguments after optional arguments.");

            this.args[i] = new Argument(this.client, args[i]);
            if (this.args[i].infinite)
                infinite = true;
        }

        this.limit = limit;
    }

    /**
     * Obtains the argument's result
     * 
     * @param {import('../message')} msg The command message
     * @param {any[]} [provided] The provided arguments from the message emitter
     * @param {number} [limit=this.limit] The limit
     * @returns {ArgumentCollectorInfo} The argument's information
     */
    async obtain(msg, provided = [], limit = this.limit) {
        this.client.manager.processor.awaiting.add(msg.sender.id + msg.channel.id);
        const values = {};
        let results = [];

        try {
            for (let i = 0; i < this.args.length; i++) {
                const arg = this.args[i];
                const result = await arg.obtain(msg, arg.infinite ? provided.slice(i) : provided[i], limit);

                if (result.cancelled) {
                    this.client.manager.processor.awaiting.delete(msg.sender.id + msg.channel.id);
                    return {
                        values: null,
                        cancelled: result.cancelled,
                        prompts: [].concat(...results.map(s => s.prompts)),
                        answers: [].concat(...results.map(s => s.answers))
                    };
                }

                values[arg.key] = result.value;
            }
        } catch (ex) {
            this.client.manager.processor.awaiting.delete(msg.sender.id + msg.channel.id);
            throw ex;
        }

        this.client.manager.processor.awaiting.delete(msg.sender.id + msg.channel.id);
        return {
            values,
            cancelled: null,
			prompts: [].concat(...results.map(res => res.prompts)),
			answers: [].concat(...results.map(res => res.answers))
        };
    }
};

/**
 * @typedef {Object} ArgumentCollectorInfo
 * @prop {Object} values The values
 * @prop {string} [cancelled] Why the argument was cancelled
 * @prop {import('eris').Message[]} results The results
 * @prop {import('eris').Message[]} answers The answers
 */