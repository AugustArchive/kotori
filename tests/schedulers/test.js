const { Scheduler } = require('../../src');

module.exports = class TestScheduler extends Scheduler {
    constructor(client) {
        super(client, { name: 'test', interval: 30 * 1000 });
    }

    run() {
        console.log('Pong!');
    }
};