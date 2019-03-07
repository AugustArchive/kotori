const { Client: DiscordClient } = require('@augu/eris');
const SchedulerManager          = require('./managers/scheduler-manager');
const DatabaseManager           = require('./managers/database-manager');
const CommandManager            = require('./managers/command-manager');
const EventManager              = require('./managers/event-manager');
const {
    create,
    ConsoleTransport,
    FileTransport
} = require('@maika.xyz/hideri');

module.exports = class Client extends DiscordClient {
    /**
     * Create a new instance of the Kotori client
     * @param {DefaultOptions} options The options
     */
    constructor(options) {
        super(options.token, options);

        this.manager    = new CommandManager(this, { path: options.commands });
        this.events     = new EventManager(this, { path: options.events });
        this.schedulers = new SchedulerManager(this, { path: options.schedulers });
        this.database   = new DatabaseManager(this, { url: options.dbURL });
        this.logger     = create({
            transports: [new ConsoleTransport(), new FileTransport(options.fileOptions.path)]
        });
        this.emojis     = {
            MONEY_BAG: ':moneybag:',
            INFO: ':information_source:',
            WARNING: ':warning:',
            ERROR: ':x:',
            NO_PERMS: ':name_badge:',
            MUSICAL_NOTES: ':musical_notes:',
            GEARS: ':gear:',
            YAY: ':tada:',
            OK: ':ok_hand:'
        };
        this.prefix = options.prefix;
        this.owners = options.owners;

        this.on('messageCreate', (msg) => this.manager.processor.process(msg));
        this.once('ready', () => {
            this.schedulers.tasks.forEach(async task => {
                if (task.disabled) return;
                
                await task.run();
                setTimeout(async() => await task.run(), task.interval);
            });          
        });
    }

    /**
     * Starts the bot
     */
    async start() {
        this.manager.start();
        this.events.start();
        this.schedulers.start();
        this.database.connect();
        await this.connect();
    }

    /**
     * Gets a shard ID
     * @param {number} i The shard ID to get
     * @returns {import('@augu/eris').Shard} The shard
     */
    getShard(i) {
        return this.ws.shards.get(i);
    }
};

/**
 * @typedef {Object} Options
 * @prop {string} token The token to the bot
 * @prop {string} prefix The prefix of the bot
 * @prop {string} commands The path to the commands
 * @prop {string} events The path to the events
 * @prop {string} dbURL The database url for MongoDB
 * @prop {string[]} owners The owners of the bot
 * @prop {KotoriFileTransportOptions} fileOptions The file transport for Hideri options
 * 
 * @typedef {Object} KotoriFileTransportOptions
 * @prop {string} path The path to the file to create or use
 * 
 * @typedef {Options & import('@augu/eris').ClientOptions} DefaultOptions
 */