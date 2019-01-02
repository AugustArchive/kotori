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
    }

    async registerCommands() {
        const categories = await readdirSync(this.client.paths.commands);
        for (let i = 0; i < categories.length; i++)
            readdir(`${this.client.paths.commands}/${categories[i]}`, (error, files) => {
                if (error)
                    this.emit('command:error', error);
                
                files.forEach(f => {
                    try {
                        const command = require(`${this.client.paths.commands}/${categories[i]}/${f}`);

                        if (typeof command === 'function')
                            command = new command(this.client);

                        if (typeof command.default === 'function')
                            command = new command.default(this.client);

                        if (!(command instanceof Command))
                            throw new SyntaxError(`Unable to register command; not an instance of Kotori.Command`);

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
        if (!command.checks.enabled)
            this.emit('command:register:error', `Command ${cmd.command} wasn't able to be registered; Command is disabled.`);
        if (this.commands.has(command.command))
            this.emit('command:register:error', `Command ${cmd.command} was unable to be registered; Command is already in the Collection.`);

        this.commands.set(cmd.command, cmd);
        this.emit('command:registered', cmd);
    }
};