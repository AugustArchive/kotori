const { Command } = require('../../../lib');

module.exports = class LocaleTestCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'localetest',
            description: 'Tests the locale key from the en-US locale: `test`',
            aliases: ['owo']
        });
    }

    async run(ctx) {
        return ctx.send(await ctx.translate('test', this.client.emojis['OK'], 'en_US'));
    }
}