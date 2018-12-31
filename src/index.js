module.exports = {
    version: require('../package').version,
    Client: require('./lib/client'),
    DatabaseFactory: require('./lib/factories/database-factory'),
    MessageCollector: require('./lib/interfaces/collector'),
    Command: require('./lib/interfaces/command'),
    Event: require('./lib/interfaces/event'),
    CommandMessage: require('./lib/interfaces/message'),
    Scheduler: require('./lib/interfaces/scheduler'),
    Schema: require('./lib/interfaces/schema'),
    CommandManager: require('./lib/managers/commands'),
    EventManager: require('./lib/managers/events'),
    SchedulerManager: require('./lib/managers/schedulers'),
    CommandProcessor: require('./lib/processors/commands'),
    EventProcessor: require('./lib/processors/events'),
    SchedulerProcessor: require('./lib/processors/schedulers'),
    RESTClient: require('./lib/util/rest')
};