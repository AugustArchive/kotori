const { Client: DiscordClient } = require('eris');
const DatabaseFactory = require('./factories/database-factory');
const CommandManager = require('./managers/commands');
const EventManager = require('./managers/events');
const SchedulerManager = require('./managers/schedulers');
const RESTClient = require('./util/rest');

module.exports = class Client extends DiscordClient {
    /**
     * Construct the Client. Start. Here.
     * 
     * @param {IClientOptions} options The options
     */
    constructor(options) {
        super(options.token, options.client || { disableEveryone: true });

        this.manager = new CommandManager(this);
        this.events = new EventManager(this);

        if (options.schedulers && options.schedulers.enabled)
            this.schedulers = new SchedulerManager(this);

        this.database = new DatabaseFactory(this, { uri: options.dbURI });
        this.paths = {
            commands: options.commands.path,
            events: options.events.path,
            schedulers: (options.schedulers && options.schedulers.enabled ? options.schedulers.path : null),
            schemas: options.schemas
        };
        this.rest = new RESTClient(this);
        this.owners = options.owners;

        this.once('ready', () => (this.schedulers ? this.schedulers.tasks.forEach(s => this.schedulers.processor.process(s)) : null));
        this.on('messageCreate', (m) => this.manager.processor.process(m));
    }

    async start() {
        this.manager
            .registerDefaultTypes()
            .registerCommands();
        this.events.start();
        this.database.start();

        if (this.schedulers)
            this.schedulers.start();

        await super.connect();
    }

    getUptime() {
        return Date.now() - this.startTime;
    }
};

/**
 * @typedef {Object} IClientOptions
 * @prop {string} token The token
 * @prop {string} [prefix] The prefix
 * @prop {ICommandOptions} [commands] The commands object
 * @prop {IEventOptions} [events] The event object
 * @prop {ISchedulerOptions} [schedulers] The schedulers object
 * @prop {string} [schemas] The schemas path
 * @prop {import('eris').ClientOptions} [client] The eris client options
 * @prop {string} [dbURI] The database uri
 * @prop {string[]} owners The owners of the bot
 */

/**
 * @typedef {Object} ICommandOptions
 * @prop {string} path The path
 */

/**
 * @typedef {Object} IEventOptions
 * @prop {string} path The path
 */

/**
 * @typedef {Object} ISchedulerOptions
 * @prop {boolean} enabled If the schedulers should be enabled
 * @prop {string} path The path
 */