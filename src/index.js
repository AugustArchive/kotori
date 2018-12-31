module.exports = {
    version: require('../package').version,
    Client: require('./lib/client'),
    DatabaseFactory: require('./lib/factories/database-factory'),
    ArgumentCollector: require('./lib/interface/collectors/argument'),
    MessageCollector: require('./lib/interfaces/collector'),
    Argument: require('./lib/interfaces/argument'),
    Command: require('./lib/interfaces/command'),
    Event: require('./lib/interfaces/event'),
    CommandMessage: require('./lib/interfaces/message'),
    Scheduler: require('./lib/interfaces/scheduler'),
    CommandManager: require('./lib/managers/commands'),
    EventManager: require('./lib/managers/events'),
    SchedulerManager: require('./lib/managers/scheduler'),
    CommandProcessor: require('./lib/processors/commands'),
    EventProcessor: require('./lib/processors/events'),
    SchedulerProcessor: require('./lib/processors/schedulers'),
    RESTClient: require('./lib/util/rest')
};