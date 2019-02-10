module.exports = class Command {
    /**
     * Create a new instance of the Command interface
     * @param {import('../client')} client The client
     * @param {CommandOptions} options The command options
     */
    constructor(client, options) {
        this.client = client;
        this.command = options.command;
        this.description = options.description;
        this.usage = options.usage || '';
        this.category = options.category || 'Generic';
        this.aliases = options.aliases || [];
        this.guildOnly = options.guildOnly || false;
        this.ownerOnly = options.ownerOnly || false;
        this.nsfw = options.nsfw || false;
        this.disabled = options.disabled || false;
        this.hidden = options.hidden || false;
        this.throttle = options.throttle || 3;
    }

    /**
     * Runs the command
     * @param {import('./context')} ctx The command context
     * @returns {Promise<void>} The promised command
     */
    async run(ctx) {
        throw new SyntaxError(`Command ${this.command} doesn't bin a run(ctx: Kotori.CommandContext) function.`);
    }

    /**
     * Gets the command format
     * @returns {string} The usage as: `{prefix}{command}{usage}`
     */
    getFormat() {
        return `${this.client.prefix}${this.command}${this.usage? ` ${this.usage}`: ''}`;
    }

    /**
     * Stringify the command instance
     */
    toString() {
        return `Command<${this.command}>`;
    }

    /**
     * JSONify the command instance
     */
    toJSON() {
        const base = {};
        const props = ["command", "description", "usage", "category", "aliases", "guildOnly", "ownerOnly", "nsfw", "disabled", "throttle"];

        for (const prop of props) {
            if (this[prop] !== undefined) this[prop] && this[prop].toJSON? this[prop].toJSON(): this[prop];
        }

        return base;
    }
};

/**
 * @typedef {Object} CommandOptions
 * @prop {string} command The command name
 * @prop {string | DescriptionSupplier} description The command description
 * @prop {string} [usage=''] The command usage (Use `Command.getFormat()` to format the usage)
 * @prop {string} [category='Generic'] The command category
 * @prop {string[]} [aliases=[]] The command aliases (returns an empty array if no aliases were provided)
 * @prop {boolean} [guildOnly=false] Whenever or not the command should be executed in a Discord guild
 * @prop {boolean} [ownerOnly=false] Whenever or not the command should be executed by the owners
 * @prop {boolean} [disabled=false] If the command is disabled
 * @prop {boolean} [nsfw=false] Whenever or not the command should be executed in a "NSFW channel
 * @prop {boolean} [hidden=false] Whenever or not the command should be on the help command
 * @prop {number} [throttle=3] The cooldown number
 * 
 * @typedef {(client: import('../client')) => string} DescriptionSupplier
 */