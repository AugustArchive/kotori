const Event = require('../../src/lib/interfaces/event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            event: 'command:register:error',
            emitter: 'commandManager'
        });
    }

    run(msg) {
        console.log(msg);
    }
};