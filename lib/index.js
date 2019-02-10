const Client = require('./client');

module.exports = {
    /**
     * Create a new instance of the Kotori client
     * @param {import('./client').DefaultOptions} options The client options
     * @returns {Client} The client instance
     */
    create: (options) => new Client(options),
    ArgumentParser: require('./interfaces/argument-parser'),
    AudioManager: require('./managers/audio-manager'),
    AudioPlayer: require('./interfaces/audio-player'),
    Client,
    Command: require('./interfaces/command'),
    CommandContext: require('./interfaces/context'),
    CommandManager: require('./managers/command-manager'),
    CommandProcessor: require('./processors/command-processor'),
    Event: require('./interfaces/event'),
    EventManager: require('./managers/event-manager'),
    EventProcessor: require('./processors/event-processor'),
    GiveawaySchema: require('./models/giveaway-schema'),
    GuildSchema: require('./models/guild-schema'),
    Language: require('./interfaces/language'),
    LanguageManager: require('./managers/language-manager'),
    MessageCollector: require('./interfaces/collector'),
    PermissionUtil: require('./util/permissions'),
    ReminderSchema: require('./models/reminder-schema'),
    RESTClient: require('./interfaces/rest'),
    Scheduler: require('./interfaces/scheduler'),
    SchedulerManager: require('./managers/scheduler-manager'),
    StarSchema: require('./models/star-schema'),
    SuggestionsSchema: require('./models/suggestions-schema'),
    TagSchema: require('./models/tag-schema'),
    UserSchema: require('./models/user-schema'),
    Util: require('./util/util'),
    version: require('../package').version
};