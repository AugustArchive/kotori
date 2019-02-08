const mongoose = require('mongoose');

module.exports = class DatabaseManager {
    /**
     * Creates a new instance of the database manager
     * @param {import('../client')} client The client
     * @param {DatabaseManagerOptions} options The database manager options
     */
    constructor(client, options) {
        /**
         * The client instance
         * @type {import('../client')}
         */
        this.client = client;

        /**
         * The options
         * @type {DatabaseManagerOptions}
         */
        this.options = Object.assign({}, options);

        /**
         * The mongoose instance
         * @type {mongoose}
         */
        this.m = mongoose;

        // Freezes the options until a hard boot (CTRL/CMD+Q) occured
        Object.freeze(this.options);
    }

    /**
     * Connects to MongoDB
     */
    async connect() {
        mongoose.Promise = global.Promise;
        await mongoose.connect(this.options.url, { useNewUrlParser: true });
        mongoose
            .connection
            .on('error', (error) => this.client.logger.error(`  Received from Mongoose:\n${error}`))
            .once('open', () => this.client.logger.info('  Successfully connected to MongoDB'));
    }

    /**
     * Destroys the connection from MongoDB
     * @param {string} [reason] The reason (default: `Killed process (CTRL+Q)`)
     * @returns {IDestroyResult} The result
     */
    async destroy(reason) {
        let trace = { success: false, error: null };

        try {
            await mongoose.connection.close(() => {
                this.client.logger.warn(`  ${this.client.user.username} will now not work since the database was closed.\nReason: ${reason? reason: 'Killed Process (CTRL+Q)'}`);
                trace.success = true;
            });
        } catch(ex) {
            trace.error = ex;
        }

        return trace;
    }
};

/**
 * @typedef {Object} DatabaseManagerOptions
 * @prop {string} url The database url
 * 
 * @typedef {Object} IDestroyResult
 * @prop {boolean} success If it was successful
 * @prop {?Error} [error] If it errored to disconnect, it results the errof
 */