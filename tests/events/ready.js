const { Event } = require('../../lib');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, 'ready');
    }

    emit() {
        this.client.logger.info(`  Logged in as ${this.client.user.username}#${this.client.user.discriminator}`);
    }
};