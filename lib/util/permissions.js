const { Constants: { Permissions } } = require('@augu/eris');

module.exports = class PermissionUtil {
    /**
     * Resolves a permission node
     * @param {IPermissionResolvable} permission The permission node
     * @returns {number} The permission bitfield
     */
    static resolve(permission) {
        if (!permission) return this.resolve(0);
        if (typeof permission === 'number' && permission >= 0) return permission;
        if (permission instanceof Array) return permission.map(p => this.resolve(p)).reduce((prev, i) => prev | i, 0);
        if (typeof permission === 'string') return Permissions[permission];
        throw new RangeError('Invalid permission bitfield.');
    }

    /**
     * Utility to check permission bitfields for users
     * @param {import('@augu/eris').Member} member The member
     * @param {Permission} permission The permission
     * @returns {boolean} If they have it or not
     */
    static hasPermission(member, permission) {
        if (member.permission.has(permission)) return true;
        else return false;
    }

    /**
     * Prettified permission bitfield
     * @param {Permission} permission The field
     * @returns {string} The prettified permission 
     */
    static humanize(permission) {
        return this.prettified[permission];
    }

    /**
     * The permissions prettified
     * @returns {{ [x: string]: string; }}
     */
    static get prettified() {
        return {
            createInstantInvite: 'Create Instant Invite',
            banMembers: 'Ban Members',
            kickMembers: 'Kick Members',
            administrator: 'Administrator',
            manageChannels: 'Manage Channels',
            manageGuild: 'Manage Guild',
            addReactions: 'Add Reactions',
            viewAuditLogs: 'View Audit Logs',
            voicePrioritySpeaker: 'Priority Speaker',
            readMessages: 'Read Messages',
            sendMessages: 'Send Messages',
            sendTTSMessages: 'Send TTS Messages',
            manageMessages: 'Manage Messages',
            embedLinks: 'Embed Links',
            attachFiles: 'Attach Files',
            readMessageHistory: 'Read Message History',
            mentionEveryone: 'Mention Everyone',
            externalEmojis: 'External Emojis',
            voiceConnect: 'Connect to VC',
            voiceSpeak: 'Speak in VC',
            voiceMuteMembers: 'Mute Members in VC',
            voiceDeafenMembers: 'Deafen Members in VC',
            voiceUseVAD: 'Use VAD',
            changeNickname: 'Change Nickname',
            manageNicknames: 'Manage Nicknames',
            manageRoles: 'Manage Roles',
            manageWebhooks: 'Manage Webhooks',
            manageEmojis: 'Manage Emojis'
        };
    }
};

/**
 * @typedef {string | number | number[]} IPermissionResolvable
 * @typedef {"createInstantInvite" | "kickMembers" | "banMembers" | "administrator" | "manageChannels" | "manageGuild" | "addReactions" | "viewAuditLogs" | "voicePrioritySpeaker" | "readMessages" | "sendMessages" | "sendTTSMessages" | "manageMessages" | "embedLinks" | "attachFiles" | "readMessageHistory" | "mentionEveryone" | "externalEmojis" | "voiceConnect" | "voiceSpeak" | "voiceMuteMembers" | "voiceDeafenMembers"| "voiceUseVAD" | "changeNickname" | "manageNicknames" | "manageRoles" | "manageWebhooks" | "manageEmojis"} Permission
 */