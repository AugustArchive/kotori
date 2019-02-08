const SchedulerManager = require('./managers/scheduler-manager');
const DatabaseManager  = require('./managers/database-manager');
const CommandManager   = require('./managers/command-manager');
const EventManager     = require('./managers/event-manager');
const AudioManager     = require('./managers/audio-manager');
const { Cluster }      = require('lavalink');
const { Client }       = require('@augu/eris');
const Hideri           = require('@maika.xyz/hideri');

module.exports = class KotoriClient extends Client {
    /**
     * Create a new instance of the Kotori client
     * @param {Options} options The options
     */
    constructor(options) {
        super(options.token, options.options || {});

        this.manager    = new CommandManager(this, { path: options.commands });
        this.events     = new EventManager(this, { path: options.events });
        this.schedulers = new SchedulerManager(this, { path: options.schedulers });
        this.audio      = new AudioManager(this);
        this.database   = new DatabaseManager(this, { url: options.dbURL });
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
        this.database.connect();
        await this.connect();
    }
};

/**
 * @typedef {Object} Options
 * @prop {string} token The token to the bot
 * @prop {string} prefix The prefix of the bot
 * @prop {string} commands The path to the commands
 * @prop {string} events The path to the events
 * @prop {string} schedulers The path to the schedulers
 * @prop {string} dbURL The database url for MongoDB
 * @prop {LavalinkOptions[]} nodes The lavalink nodes to connect to
 * @prop {import('@augu/eris').ClientOptions} [options] Eris' client options
 * 
 * @typedef {Object} LavalinkOptions
 * @prop {string} [host='127.0.0.1'] The host url (default: `127.0.0.1`)
 * @prop {string} [password='youshallnotpass'] The authenication of Lavalink (default: `youshallnotpass`)
 * @prop {number} [port=2333] The port for WebSocket & HTTP requests (default: `2333`)
 */