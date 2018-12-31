const ArgumentCollector = require('./collectors/argument');

module.exports = class Command {
    /**
     * The command interface
     * 
     * @param {import('../client')} client The client
     * @param {CommandInfo} info The command info
     */
    constructor(client, info) {
        this.client = client;
        this.command = info.command;
        this.description = info.description;
        this.usage = info.usage || '';
        this.category = info.category || 'Generic';
        this.aliases = info.aliases || [];
        this.checks = info.checks || {
            guild: false,
            owner: false,
            nsfw: false,
            enabled: true
        };
        this.argsCollector = info.args && info.args.length ? new ArgumentCollector(client, info.args) : null;
        if (this.argsCollector)
            this.format = this.argsCollector.args.reduce((prev, curr) => {
                const wrap = {
                    left: curr.default !== null ? '[' : '<',
                    right: curr.default !== null ? ']' : '<'
                };
                return `${prev}${prev ? ' ' : ''}${wrap.left}${curr.label}${curr.infinite ? '...' : ''}${wrap.right}`;
            }, '');
    }

    /**
     * Run the command
     * 
     * @param {import('./message')} msg The command message
     * @param {Object|string|string[]} args The arguments
     * @returns {Promise<void>} The promised command
     */
    async run(msg, args) {
        throw new SyntaxError(`Command "${this.constructor.name}" doesn't have a run(msg: Kotori.CommandMessage, args: Object | string | string[]) function avaliable.`);
    }
};

/**
 * @typedef {Object} CommandInfo
 * @prop {string} command The command name
 * @prop {string} description The command description
 * @prop {string} [usage=''] The command usage
 * @prop {string} [category] The command category
 * @prop {string[]} [aliases=[]] The command aliases
 * @prop {ICommandChecks} [checks] The command checks
 * @prop {import('./argument')[]} [args] The arguments
 */

/**
 * @typedef {Object} ICommandChecks
 * @prop {boolean} [guild=false] If the command should be ran in a guild
 * @prop {boolean} [owner=false] If the command should be ran by the owners
 * @prop {boolean} [nsfw=false] If the command should be ran in a NSFW channel
 * @prop {boolean} [enabled=true] Ifd the command should be enabled
 */