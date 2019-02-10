module.exports = class Event {
    /**
     * Construct a new Event interface
     * @param {import('../client')} client The client instance
     * @param {EventEmittable} event The event to run
     */
    constructor(client, event) {
        this.client = client;
        this.event = event;
    }

    /**
     * Emits the event
     * @param {...any[]} args Any arguments to pass
     */
    async emit(...args) {}
};

/**
 * @typedef {"ready" | "disconnect" | "callCreate" | "callRing" | "callDelete" | "callUpdate" | "channelCreate" | "channelDelete" | "channelPinUpdate" | "channelRecipientAdd" | "channelRecepientRemove" | "channelUpdate" | "friendSuggestionCreate" | "friendSuggestionDelete" | "guildAvaliable" | "guildBanAdd" | "guildBanRemove" | "guildDelete" | "guildUnavaliable" | "guildCreate" | "guildEmojisUpdate" | "guildMemberAdd" | "guildMemberChunk" | "guildMemberRemove" | "guildMemberUpdate" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "hello" | "messageCreate" | "messageDeleteBulk" | "messageReactionRemoveAll" | "messageDeleteBulk" | "messageDelete" | "messageReactionAdd" | "messageReactionRemove" | "messageUpdate" | "presenceUpdate" | "rawWS" | "unknown" | "relationshipAdd" | "relationshipRemove" | "relationshipUpdate" | "typingStart" | "unavaliableGuildCreate" | "userUpdate" | "voiceChannelJoin" | "voiceChannelLeave" | "voiceChannelSwitch" | "voiceStateUpdate" | "warn" | "debug" | "shardDisconnect" | "error" | "shardPreReady" | "connect" | "shardReady" | "shardResume"} EventEmittable
 */