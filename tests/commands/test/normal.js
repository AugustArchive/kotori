const { Command } = require('../../../src');

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'test',
            description: 'Beep boop.'
        });
    }

    run(msg) {
        msg.reply('hewwo');
    }
};