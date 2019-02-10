import Eris from '@augu/eris';
import { Collection } from '@maika.xyz/eris-utils';
import Hideri from '@maika.xyz/hideri';
import { Player } from 'lavalink';

/** The heart and soul of Maika. */
declare namespace Kotori {
    /**
     * The version of the component: `@maika.xyz/kotori`
     */
    export const version: string;

    /**
     * Create a new instance of Kotori
     * 
     * The `create` function is here so you can use `Kotori.create()` to return the `Client` instance but you can still do `new KotoriClient()`.
     * @param options The additional options to create the client
     * @returns The client instance
     */
    export function create(options: Kotori.DefaultOptions): Kotori.Client;

    // #region Classes
    /** The argument parser */
    export class ArgumentParser {
        public arguments: string[];

        /**
         * Create a new instance of the argument parser
         * @param arguments The arguments to construct
         */
        constructor(arguments: string[]);
        
        /**
         * Gets the argument string
         * @param index The index number to get
         * @returns The argument string
         */
        public get(index: number): string;

        /**
         * Checks if the index of the argument is empty
         * @param index The index number to check
         * @returns A boolean if it is or not
         */
        public isEmpty(index: number): boolean;

        /**
         * Gathers the arguments
         * @param sep The seperator to seperate it (default: `' '`)
         * @returns The gathered arguments
         */
        public gather(sep?: string): string;

        /**
         * Removes the first element and returns the argument(s)
         * @returns The arguments but the first element removed
         */
        public shift(): string[];
    }

    /** The audio manager for Maika */
    export class AudioManager {
        public client: Kotori.Client;
        public players: Collection<AudioPlayer>;

        /**
         * Construct a new audio manager instance
         * @param client The client instance
         */
        constructor(client: Kotori.Client);

        /**
         * Creates a player for the guild
         * @param guild The guild
         * @returns The player
         */
        public createPlayer(guild: Eris.Guild): AudioPlayer;

        /**
         * Gets the player from the guild
         * @param guild The guild
         * @returns The audio player
         */
        public getPlayer(guild: Eris.Guild): AudioPlayer;

        /**
         * If the `AudioManager` created an audio player for the guild
         * @param guild The guild
         * @returns A boolean if they have an audio player created
         */
        public hasPlayer(guild: Eris.Guild): boolean;

        /**
         * Destroys the audio player
         * @param guild The guild
         * @returns the player destroyed
         */
        public destroy(guild: Eris.Guild): void;
    }

    /** The audio player for Maika */
    export class AudioPlayer {
        public client: Kotori.Client;
        public guild: Eris.Guild;
        public queue: Kotori.LavalinkTrack[];
        public repeat: boolean;

        /**
         * Constructs an new `AudioPlayer` instance
         * @param client The client instance
         * @param guild The guild that created this
         */
        constructor(client: Kotori.Client, guild: Eris.Guild);

        /**
         * Gets the Lavalink player
         * @returns The lavalink player
         */
        public getPlayer(): Player;

        /**
         * Gets the current song
         * @returns The track
         */
        public getCurrentSong(): Kotori.LavalinkTrack;

        /**
         * Checks if any audio is playing
         * @returns If it is or not
         */
        public isPlaying(): boolean;

        /**
         * Checks if any audio is playing or the track is pauised
         * @returns If it is or not
         */
        public isBusy(): boolean;

        /**
         * Checks if the track is paused
         * @returns If it is or not
         */
        public isPaused(): boolean;
    }

    // Methods for AudioPlayer:
    // isBusy(): boolean;
    // isPaused(): boolean;
    // enqueue(track: Kotori.LavalinkTrack, unshift?: boolean): void;
    // pause(): void;
    // resume(): void;
    // setVolume(vol: number): void;
    // stop(): void;
    // destroy(): void;
    // play(options?: { start: number; end: number; }): void;

    /** The client to initisate from */
    export class Client {}

    /** The command interface */
    export class Command {}

    /** The command context */
    export class CommandContext {}

    /** The command manager to manage "command" related stuff */
    export class CommandManager {}

    /** The command processor to process all commands */
    export class CommandProcessor {}

    /** The event interface */
    export class Event {}

    /** The event manager to manage all "event" releated stuff */
    export class EventManager {}

    /** The event processor to process all events */
    export class EventProcessor {}

    /** The language interface */
    export class Language {}

    /** The language manager to manage all "language" related stuff */
    export class LanguageManager {}

    /** The message collector for awaiting messages */
    export class MessageCollector {}

    /** Permission utils for Discord permissions */
    export class PermissionUtil {}

    /** The REST client to grab Discord objects */
    export class RESTClient {}

    /** The scheduler interface */
    export class Scheduler {}

    /** The scheduler manager to manage all "task" related stuff */
    export class SchedulerManager {}

    /** Other utilities */
    export class Util {}
    // #endregion Classes

    // #region Types
    
    /** Type definition for type: `ILavalinkTrack` */
    export type ILavalinkTrack = {
        /** The unique identifier of the track, as defined by the provider (youtube, soundcloud, etc..) */
        identifier: string;

        /** Whether the use of the seek method is possible */
        isSeekable: boolean;

        /** The name of the author of the track */
        author: string;

        /** The duration of the track in milliseconds */
        length: number;

        /** Whether the track is a livestream or not */
        isStream: boolean;

        /** The current position of the player in the track, represented in milliseconds */
        position: number;

        /** The title of the track */
        title: string;

        /** The URL of the track */
        uri: string;
    };

    /** Type definition for type: `LavalinkTrack` */
    export type LavalinkTrack = {
        /** The base64 encoded track name */
        name: string;

        /** The track information */
        track: Kotori.ILavalinkTrack;
    }

    // #endregion Types
}

declare module '@maika.xyz/kotori' { 
    export = Kotori; 
}