const Base = require('./base');

module.exports = class GuildSettings extends Base {
    /**
     * Create a new instance of the Guild settings base
     * @param {import('../client')} client The client
     */
    constructor(client) {
        super(client);

        this.schema = require('../models/guild-schema');
    }

    /**
     * Grabs the guild settings
     * @param {string} id The ID
     * @returns {Promise<IGuildSettings>} The guild settings
     */
    async get(id) {
        const guild = await this.schema.findOne({
            guildID: id
        }).lean().exec();

        if (!guild || guild === null) {
            const query = new this.schema({ guildID: id, prefix: this.client.prefix });
            query.save();
            return query;
        }

        return guild;
    }

    /**
     * Update anything and return a callback
     * @param {KotoriDocumentOptions} options Additional contexial options
     * @returns {Promise<any>} A empty promise
     */
    update(options) {
        const { id, doc, callback: fn } = options;
        this
            .schema
            .updateOne({ guildID: id }, doc, (error, data) => {
                if (error) return fn(error, null);
                fn(null, data);
            }).exec();
    }

    /**
     * Deletes the guild settings
     * @param {string} id The ID
     * @returns {Promise<void>} A empty promise
     */
    async delete(id) {
        await this
            .schema
            .findOne({ guildID: id })
            .remove()
            .exec();
    }
}

/**
 * @typedef {Object} NormalSettings
 * @prop {boolean} enabled If the setting should be enabled
 * @prop {string} channelID The channel ID (If there isn't no ID specified, it would be `null`)
 * 
 * @typedef {Object} IGuildSettings
 * @prop {string} guildID The guild ID
 * @prop {string} prefix The prefix
 * @prop {NormalSettings} modlog Mod Log feature
 * @prop {NormalSettings} reddit The reddit feed
 * @prop {object} starboard Starboard feature
 * @prop {boolean} starboard.enabled If the setting should be enabled
 * @prop {string} starboard.channelID The channel ID (If there isn't no ID specified, it would be `null`)
 * @prop {string} starboard.emoji The emoji to add as an reaction
 * @prop {number} starboard.threshold The minimium amount of stars to hold
 * @prop {object} suggestions Suggestions feature
 * @prop {boolean} suggestions.enabled If the setting should be enabled
 * @prop {string} suggestions.channelID The channel ID (If there isn't no ID specified, it would be `null`)
 * @prop {{ emoji: string; amount: number; }} suggestions.upvotes Upvotes object
 * @prop {{ emoji: string; amount: number; }} suggestions.downvotes Downvotes object
 * @prop {Tag[]} tags The array of tags
 * @prop {string[]} autoroles Any autoroles assigned
 * @prop {string[]} assignable Self-Assignable roles to add
 * @prop {{ is: boolean; reason: string; }} blacklist The blacklist
 * 
 * @typedef {Object} KotoriDocumentOptions
 * @prop {string} id The ID
 * @prop {any} doc A document to insert
 * @prop {(error: Error, data: IGuildSettings) => void} callback The callback
 * 
 * @typedef {Object} Tag
 * @prop {string} content The content to send
 * @prop {string} userID The user who made it
 */