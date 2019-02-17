const MessageCollector = require('./collector');
const ArgumentParser   = require('./argument-parser');
const GuildSettings    = require('../settings/guild-settings');
const UserSettings     = require('../settings/user-settings');

module.exports = class CommandContext {
    /**
     * Creates a new instance of the command context interface
     * @param {import('../client')} client The client
     * @param {import('@augu/eris').Message} msg The message
     * @param {string[]} args The arguments
     */
    constructor(client, msg, args) {
        Object.assign(this, msg);

        this.client = client;
        this.message = msg;
        this.args = new ArgumentParser(args);
        this.guild = msg.guild;
        this.channel = msg.channel;
        this.guildSettings = new GuildSettings(client);
        this.userSettings = new UserSettings(client);
    }

    /**
     * Gets the collector
     * @returns {MessageCollector} The collector instance
     */
    get collector() {
        return new MessageCollector(this.client);
    }

    /**
     * Translates the user's locale
     * @param {string} key The key to translate
     * @returns {string} The translated key
     */
    async translate(key, ...args) {
        const userSettings = await this.userSettings.get(this.author.id);
        const locale       = this.client.languages.locales.get(userSettings['locale']);
        return locale.translate(key, ...args);
    }

    /**
     * Sends a message to a channel
     * @param {string} content The content to send
     * @returns {PromisedMessage} The message
     */
    async send(content) {
        return this.message.channel.createMessage(content);
    }

    /**
     * Sends a discord embed to a channel
     * @param {import('@augu/eris').Embed} content The content to send
     * @returns {PromisedMessage} The promised message
     */
    async embed(content) {
        const embed = Object.assign({ color: 0, type: 'rich' }, content);
        return this.message.channel.createMessage({ embed });
    }
};

/**
 * @typedef {Promise<import('@augu/eris').Message>} PromisedMessage
 */