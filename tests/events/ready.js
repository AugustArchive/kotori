const Event = require('../../src/lib/interfaces/event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            event: 'ready',
            emitter: 'client'
        });
    }

    run() {
        console.log('[Mafuyu] Ready');
    }
};