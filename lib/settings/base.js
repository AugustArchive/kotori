module.exports = class SettingsBase {
    /**
     * Construct a new base
     * @param {import('../client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Gets the settings
     * @param {string} id The id
     * @returns {any} The settings
     */
    get(id) {
        throw new SyntaxError(`${this.constructor.name}> Function "get(id: string): U" wasn't implemented`);
    }

    /**
     * Deletes the settings base
     * @param {string} id The ID
     * @returns {void} The settings removed
     */
    delete(id) {
        throw new SyntaxError(`${this.constructor.name}> Function "delete(id: string): void" wasn't implemented.`);
    }
}