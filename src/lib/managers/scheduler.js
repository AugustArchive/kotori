const { readdir } = require('fs');
const { EventEmitter } = require('events');
const SchedulerProcessor = require('../processors/schedulers');
const Scheduler = require('../interfaces/scheduler');

module.exports = class SchedulerManager extends EventEmitter {};