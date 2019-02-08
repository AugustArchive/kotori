const { Collection } = require('@maika.xyz/eris-utils');
const AudioPlayer    = require('../interfaces/audio-player');

module.exports = class AudioManager {
    /**
     * Creates a new instance of the audio manager
     * @param {import('../client')} client The client
     */
    constructor(client) {
        /**
         * The client instance
         * @type {import('../client')}
         */
        this.client = client;

        /**
         * The player collection
         * @type {Collection<AudioPlayer>}
         */
        this.players = new Collection();
    }

    /**
     * Creates a new player for a guild
     * @param {import('@augu/eris').Guild} guild The guild
     * @returns {AudioPlayer} The player instance
     */
    createPlayer(guild) {
        const player = new AudioPlayer(this.client, guild.id);
        this.players.set(guild.id, player);
        return player;
    }

    /**
     * If the guild has an audio player
     * @param {import('@augu/eris').Guild} guild The guild
     * @returns {boolean} If the guild has an audio player or not
     */
    hasPlayer(guild) {
        return this.players.has(guild.id);
    }

    /**
     * Gets the guild's audio player
     * @param {import('@augu/eris').Guild} guild The guild
     * @returns {AudioPlayer} The player instance
     */
    getPlayer(guild) {
        return this.players.get(guild.id);
    }
};