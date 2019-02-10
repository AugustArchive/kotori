const Kotori = require('../lib');
const config = require('./config');
const path   = require('path');

const bot = Kotori.create({
    token: config.token,
    prefix: config.prefix,
    owners: ['280158289667555328'],
    commands: path.join(__dirname, 'commands'),
    events: path.join(__dirname, 'events'),
    schedulers: path.join(__dirname, 'schedulers'),
    languages: path.join(__dirname, 'languages'),
    dbURL: config.mongodb,
    nodes: [
        {
            host: config.lavalink.host,
            password: config.lavalink.password,
            port: 2333
        }
    ],
    maxShards: 'auto',
    disableEveryone: true
});

bot.start();