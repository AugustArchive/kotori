const Schema = require('../models/user-schema');
const Base   = require('./base');

module.exports = class UserSettings extends Base {
    /**
     * Create a new instance of the user settings
     * @param {import('../client')} client The client
     */
    constructor(client) {
        super(client);

        this.schema = Schema;
    }

    /**
     * Gets the user settings
     * @param {string} id The ID
     * @returns {Promise<IUserSettings>} The user's settings
     */
    async get(id) {
        const user = await this.schema.findOne({ userID: id }).lean().exec();

        if (!user) {
            const query = new this.schema({ userID: id });
            query.save();
            return query;
        }

        return user;
    }

    /**
     * Updates any document
     * @param {DocumentOptions} options The document options
     * @returns {Promise<void>} Empty promise 
     */
    async update(options) {
        const {
            id,
            callback: fn,
            doc: document
        } = options;

        this
            .schema
            .updateOne({ userID: id }, document, (error, data) => {
                if (error) return fn(error, null);
                fn(null, data);
            }).exec();
    }

    /**
     * Deletes the user's settings
     * @param {string} id The ID
     * @returns {Promise<void>} Empty promise
     */
    async delete(id) {
        await this
            .schema
            .findOne({ userID: id })
            .remove()
            .exec();
    }
}

/**
 * @typedef {Object} IUserSettings
 * @prop {string} userID The user ID
 * @prop {string} locale The locale
 * @prop {number} coins The number of coins
 * @prop {{ badge: string; description: string; }} profile Profile
 * 
 * @typedef {import('./guild-settings').KotoriDocumentOptions} DocumentOptions
 */