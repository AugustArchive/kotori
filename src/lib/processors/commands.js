module.exports = class CommandProcessor {
    /**
     * The command processor to process commands
     * 
     * @param {import('../client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Process the messageCreate event
     * 
     * @param {import('eris').Message} msg The message
     */
    async process(msg) {
        // Everyone is gonna do their own CommandHandler since Maika's and another person's bot might have different schemas
        // for guilds.
        throw new SyntaxError("CommandProcessor requires a process(msg: Eris.Message) to be ran!");
    }
};