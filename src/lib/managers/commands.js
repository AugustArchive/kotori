const { Collection } = require('@maika.xyz/eris-utils');
const { readdir, readdirSync } = require('fs');
const CommandProcessor = require('../processors/commands');
const { EventEmitter } = require('events');
const Command = require('../interfaces/command');

module.exports = class CommandManager extends EventEmitter {
    /**
     * Construct the CommandManager instance
     * 
     * @param {import('../client')} client The client
     */
    constructor(client) {
        super();
        this.client = client;
        this.processor = new CommandProcessor(client);

        /**
         * @type {Collection<string, Command>}
         */
        this.commands = new Collection();

        /**
         * @type {Collection<string, import('../interfaces/type')>}
         */
        this.types = new Collection();
    }

    async start() {
        const categories = await readdirSync(this.client.paths.commands);
        for (let i = 0; i < categories.length; i++)
            readdir(`${this.client.paths.commands}/${categories[i]}`, (error, files) => {
                if (error)
                    this.emit('command:error', error);
                
                files.forEach(f => {
                    try {
                        const command = require(`${this.client.paths.commands}/${categories[i]}/${f}`);
                        if (!(command instanceof Command))
                            throw new SyntaxError("Command wasn't an instanceof Kotori.Command");

                        const c = new command(this.client);
                        this.registerCommand(command);
                    } catch(ex) {
                        this.emit('command:error', ex);
                    }
                });
            });
    }

    /**
     * Registers the command
     * 
     * @param {Command} cmd The command
     * @returns {void} nOOOOOOOp
     */
    registerCommand(cmd) {
        if (!cmd.checks.enabled)
            this.emit('command:register:error', `Command ${cmd.command} wasn't able to be registered: Command is disabled.`);
        if (this.commands.has(cmd))
            this.emit('command:register:error', `Command ${cmd.command} was unable to be registered: Command is already in the Collection.`);

        this.commands.set(cmd.command, cmd);
        this.emit('command:registered', cmd);
    }

    /**
     * Registers an argument type
     * 
     * @param {import('../interfaces/type')} type The argument type to register
     * @returns {void} nOOp
     */
    registerType(type) {
        if (this.types.has(type.id))
            this.emit('argtype:register:error', `Argument Type "${type.id}" wasn't able to be registered: Argument Type is already registered.`);

        this.types.set(type.id, type);
        this.emit('argtype:register:error');
    }
};