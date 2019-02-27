const { readdir, readdirSync } = require('fs');
const CommandProcessor = require('../processors/command-processor');
const { Collection } = require('@maika.xyz/eris-utils');

module.exports = class CommandManager {
    /**
     * Creates a new instance of the command manager
     * @param {import('../client')} client The client
     * @param {CommandManagerOptions} options The options
     */
    constructor(client, options) {
        /**
         * The client instance
         * @type {import('../client')}
         */
        this.client = client;

        /**
         * The options
         * @type {CommandManagerOptions}
         */
        this.options = Object.assign({}, options);

        /**
         * The command collection
         * @type {Collection<import('../interfaces/command')>}
         */
        this.commands = new Collection();

        /**
         * The command processor
         * @type {CommandProcessor}
         */
        this.processor = new CommandProcessor(client);

        // Freezes the options (until a hard reboot (CTRL / CMD + Q) occurs)
        Object.freeze(this.options);
    }
    
    /**
     * Starts the process of the commands
     */
    async start() {
        const categories = await readdirSync(this.options.path);
        this.client.logger.info(`  Building commands... (${categories.length} Categories)`);

        for (let i = 0; i < categories.length; i++) readdir(`${this.options.path}/${categories[i]}`, (error, files) => {
            if (error) this.client.logger.error(`  Unable to build commands:\n${error.stack}`);

            this.client.logger.info(`  Building ${files.length} commands in ${categories[i]} category...`);
            files.forEach(f => {
                try {
                    const Command = require(`${this.options.path}/${categories[i]}/${f}`);
                    const command = new Command(this.client);

                    if (command.disabled) {
                        this.client.logger.warn(`Command ${command.command} is disabled.`);
                        return;
                    }

                    command.setFile(`${this.options.path}/${categories[i]}/${f}`);
                    this.commands.set(command.command, command);
                    this.client.logger.info(`Successfully initialized command ${command.command}!`);
                } catch(ex) {
                    this.client.logger.error(`Unable to build the command:\n${ex.stack}`);
                }
            });
        });
    }
};

/**
 * @typedef {Object} CommandManagerOptions
 * @prop {string} path The path
 */
