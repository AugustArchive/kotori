const { Client: DiscordClient } = require('@augu/eris');
const SchedulerManager          = require('./managers/scheduler-manager');
const LanguageManager           = require('./managers/language-manager');
const DatabaseManager           = require('./managers/database-manager');
const CommandManager            = require('./managers/command-manager');
const EventManager              = require('./managers/event-manager');
const AudioManager              = require('./managers/audio-manager');
const { Cluster }               = require('lavalink');
const RESTClient                = require('./interfaces/rest');
const Hideri                    = require('@maika.xyz/hideri');

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
        this.audio      = new AudioManager(this);
        this.database   = new DatabaseManager(this, { url: options.dbURL });
        this.languages  = new LanguageManager(this, { path: options.languages });
        this.logger     = Hideri.create();
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
        this.rest   = new RESTClient(this);

        this.on('messageCreate', (msg) => this.manager.processor.process(msg));
        this.once('ready', () => {
            this
                .schedulers
                .tasks
                .forEach((f) => f.run(this));

            /** @type {import('lavalink').ClusterNodeOptions[]} */
            const nodes = [];
            options.nodes.forEach((node) => {
                nodes.push({
                    hosts: {
                        ws: `ws://${node.host || '127.0.0.1'}:${node.port || 2333}`,
                        rest: `ws://${node.host || '127.0.0.1'}:${node.port || 2333}`
                    },
                    password: node.password || 'youshallnotpass',
                    shardCount: this.ws.shards.size,
                    userID: this.user.id
                });
            });
            this.lavalink = new Cluster({
                nodes,
                send: (guildID, packet) => {
                    const shardID = this.guildShardMap[guildID];
                    const shard = this.ws.shards.get(shardID);

                    if (!shard) return;
                    return shard.ws.send(JSON.stringify(packet));
                }
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
        this.languages.start();
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

    /**
     * Gets the guild's settings
     * @param {string} id The guild ID
     * @returns {Promise<any>} The settings
     */
    async getGuildSettings(id) {
        const model = require('./models/guild-schema');
        const guild = await model.findOne({ guildID: id }).lean().exec();

        if (!guild) {
            const query = new model({ guildID: id, prefix: this.prefix });
            query.save();
            this.logger.info(`  Guild ${this.guilds.get(id).name} has successfully been added to the database.`);
        }

        return guild;
    }

    /**
     * Gets the user's settings
     * @param {string} id The user ID
     * @returns {Promise<any>} The settings
     */
    async getUserSettings(id) {
        const model = require('./models/user-schema');
        const user = await model.findOne({ userID: id }).lean().exec();

        if (!user) {
            const query = new model({ userID: id });
            query.save();
            this.logger.info(`  User ${this.users.get(id).username} has successfully been added to the database.`);
        }

        return user;
    }
};

/**
 * @typedef {Object} Options
 * @prop {string} token The token to the bot
 * @prop {string} prefix The prefix of the bot
 * @prop {string} commands The path to the commands
 * @prop {string} events The path to the events
 * @prop {string} schedulers The path to the schedulers
 * @prop {string} languages The path to your languages
 * @prop {string} dbURL The database url for MongoDB
 * @prop {LavalinkOptions[]} nodes The lavalink nodes to connect to
 * @prop {string[]} owners The owners of the bot
 * 
 * @typedef {Object} LavalinkOptions
 * @prop {string} [host='127.0.0.1'] The host url (default: `127.0.0.1`)
 * @prop {string} [password='youshallnotpass'] The authenication of Lavalink (default: `youshallnotpass`)
 * @prop {number} [port=2333] The port for WebSocket & HTTP requests (default: `2333`)
 * 
 * @typedef {Options & import('@augu/eris').ClientOptions} DefaultOptions
 */