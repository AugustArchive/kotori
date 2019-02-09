module.exports = class AudioPlayer {
    /**
     * Construct a new audio player instance
     * @param {import('../client')} client The client
     * @param {import('@augu/eris').Guild} guild The guild
     */
    constructor(client, guild) {
        /**
         * The client instance
         * @type {import('../client')}
         */
        this.client = client;

        /**
         * The guild
         * @type {import('@augu/eris').Guild}
         */
        this.guild = guild;

        /**
         * The queue
         * @type {LavalinkTrack[]}
         */
        this.queue = [];
        this.repeat = false;

        this.getPlayer().on('event', this.handleEvents.bind(this));
    }

    /**
     * Gets the player
     * @returns {import('lavalink').Player}
     */
    getPlayer() {
        return this.client.lavalink.get(this.guild.id);
    }

    /**
     * Gets the current song in the queue
     * @returns {LavalinkTrack}
     */
    getCurrentSong() {
        return this.queue[0];
    }

    /**
     * If there is any audio conceiving
     * @returns {boolean} If it is or not
     */
    isPlaying() {
        const player = this.getPlayer();
        return player.playing;
    }

    /**
     * Checks if the audio is paused
     * @returns {boolean} If it is or not
     */
    isPaused() {
        const player = this.getPlayer();
        return player.paused;
    }

    /**
     * If the player is "busy"
     * @returns {boolean} If it is or not
     */
    isBusy() {
        return this.isPlaying() || this.isPaused();
    }

    /**
     * Enqueues a track
     * @param {LavalinkTrack} track The track
     * @param {boolean} [unshift=false] If the track should unshift from the queue
     */
    enqueue(track, unshift = false) {
        if (unshift) this.queue.unshift(track);
        else this.queue.push(track);

        return this.play();
    }

    /**
     * Pauses the track
     */
    pause() {
        const player = this.getPlayer();
        return player.pause(true);
    }

    /**
     * Resumes the track
     */
    resume() {
        const player = this.getPlayer();
        return player.pause(false);
    }

    /**
     * Stops the song
     */
    stop() {
        const player = this.getPlayer();
        return player.stop();
    }

    /**
     * Destroys the player
     */
    destroy() {
        this.stop();
        this.getPlayer().destroy();
    }

    /**
     * Sets the volume
     * @param {number} vol The volume
     */
    setVolume(vol) {
        const player = this.getPlayer();
        player.setVolume(vol);
    }

    /**
     * Plays the song
     * @param {{ start: number; end: number }} [options] The options
     */
    async play(options) {
        if (this.isBusy() || !this.queue.length) return;
        const song = this.getCurrentSong();
        await this.player.play(song.track, options);
    }

    /**
     * Handles the event
     */
    handleEvents(event) {
        const shifted = this.queue.shift();
        switch (event.type) {
            case "TrackEndEvent": {
                this.startEvent('end', shifted);
            } break;
            case "TrackExceptionEvent": {
                this.startEvent('errored');
            } break;
            default: {
                this.startEvent('stuck');
            } break;
        }
    }

    /**
     * Starts an Lavalink event
     * @param {"end" | "errored" | "stuck"} event The event
     * @param {LavalinkTrack} [song] The song (default null since it's only for the ended event)
     */
    startEvent(event, song) {
        switch (event) {
            case "end": {
                if (this.repeat && song) this.play();
                if (this.queue.length === 0) this.getPlayer().leave();

                this.play();
            } break;
            case "errored": {
                // TODO: Add `AudioPlayer.channelID` to do messages
                this.client.logger.error("  Lavalink has errored.");
            } break;
            case "stuck": {
                this.client.logger.error("  Track is stuck, now playing next song...");
                this.play();
            } break;
            default: {
                this.client.logger.error('  Invalid event. ("end" | "errored" | "stuck")');
            } break;
        }
    }
};

// Credit for Type Definitions: https://github.com/ParadoxalCorp/felix-production/blob/master/structures/HandlersStructures/MusicConnection.js#L10
/**
 * @typedef {Object} ILavalinkTrack
 * @prop {string} identifier The unique identifier of the track, as defined by the provider (youtube, soundcloud..)
 * @prop {boolean} isSeekable Whether the use of the seek method is possible
 * @prop {string} author The name of the author of the track
 * @prop {number} length The duration of the track in milliseconds
 * @prop {boolean} isStream Whether the track is a live-stream
 * @prop {number} position The current position of the player in the track, represented in milliseconds
 * @prop {string} title The title of the track
 * @prop {string} uri The URL to the track
 * 
 * @typedef {Object} LavalinkTrack
 * @prop {string} name The base 64 encoded track name
 * @prop {ILavalinkTrack} track The track information
 */