const { Scheduler } = require('../../lib'); // Replace "../../lib" with "@maika.xyz/kotori"

module.exports = class TestScheduler extends Scheduler {
    constructor(client) {
        super(client, { name: 'test', interval: 60 * 1000 });
    }

    run() {
        const mypingiguess = Date.now();
        this.client.logger.info(`  PONG ${Date.now() - mypingiguess}`);
    }
};