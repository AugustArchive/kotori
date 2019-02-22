const MessageCollector = require('./collector');
const ArgumentParser   = require('../parsers/argument-parser');
const GuildSettings    = require('../settings/guild-settings');
const UserSettings     = require('../settings/user-settings');
const FlagParser       = require('../parsers/flag-parser');

module.exports = class CommandContext {
    /**
     * Creates a new instance of the command context interface
     * @param {import('../client')} client The client
     * @param {import('@augu/eris').Message} msg The message
     * @param {import('./command')} command The command
     * @param {string[]} args The arguments
     */
    constructor(client, msg, command, args) {
        Object.assign(this, msg);

        this.client = client;
        this.message = msg;
        this.args = new ArgumentParser(args);
        this.command = command;
        this.guild = msg.guild;
        this.channel = msg.channel;
        this.sender = msg.author;
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
        const embed = Object.assign({ color: 0xFFD1DC, type: 'rich' }, content);
        return this.message.channel.createMessage({ embed });
    }

    /**
     * Sends a codeblock to a Discord channel
     * @param {string} lang The language
     * @param {string} content The content to Sends
     * @returns {PromisedMessage} The created message
     */
    async code(lang, content) {
        const codeblock = '```';
        return this.send(`${codeblock}${lang || ''}\n${content}\n${codeblock}`);
    }

    /**
     * Send a DM to a user
     * @param {string} content The content to send
     * @param {{ user: import('@augu/eris').User; embed?: import('@augu/eris').Embed }} [options] Any options to add as contextial
     * If no options were defined, the user will resolve as the sender
     * @returns {PromisedMessage} The created message
     */
    async dm(content, options) {
        const user = options.user? options.user: this.sender;
        const channel = await user.getDMChannel();

        if (options.embed) {
            const embed = Object.assign({ color: 0xFFD1DC, type: 'rich' }, options.embed);
            return channel.createMessage({ embed });
        } else return channel.createMessage(content);
    }
};

/**
 * @typedef {Promise<import('@augu/eris').Message>} PromisedMessage
 */