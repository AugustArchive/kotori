const { Client } = require('../src');
const { token, prefix, dbURI } = require('./config');
const path = require('path');

new Client({
    token,
    prefix,
    dbURI,
    commands: { path: path.join(__dirname, 'commands') },
    events: { path: path.join(__dirname, 'events') },
    schedulers: { enabled: true, path: path.join(__dirname, 'schedulers') },
    schemas: path.join(__dirname, 'schemas'),
    owners: ['280158289667555328']
}).start();