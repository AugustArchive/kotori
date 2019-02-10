const { Command } = require('../../../lib');

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'test',
            description: 'A debug test command, what did you expect?',
            usage: '<...text>',
            aliases: ['yeet', 'debug']
        });
    }

    /**
     * Runs the `test` command
     * @param {import('../../../lib/interfaces/context')} context The command context
     */
    run(context) {
        if (context.args.isEmpty(0)) {
            const usage = this.getFormat();
            return context.send(`${this.client.emojis['ERROR']} **|** Invalid usage. \`${usage}\``);
        }

        const text = context.args.gather(' ');
        return context.send(`${this.client.emojis['OK']} **|** ${text}`);
    }
}