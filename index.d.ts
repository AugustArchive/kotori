// TypeScipt Typings for component: "@maika.xyz/kotori"
declare module '@maika.xyz/kotori' {
    import { Client as DiscordClient, Message, Guild, ClientOptions, User, TextChannel, CategoryChannel, VoiceChannel, Member, Role, EmbedOptions } from 'eris';
    import { Collection } from '@maika.xyz/eris-utils';
    import { EventEmitter } from 'events';
    import { Schema, Mongoose, Collection as MongooseCollection, SchemaDefinition } from 'mongoose';

    export const version: string;
    export class Client extends DiscordClient {
        constructor(options: IClientOptions);

        public manager: CommandManager;
        public events: EventManager;
        public schedulers?: SchedulerManager;
        public database: DatabaseFactory;
        public rest: RESTClient;
        public owners: string[];
        public prefix: string;
        public paths: { commands: string; events: string; schemas: string; schedulers?: string; };
        public start(): Promised;
        public getUptime(): number;
    }
    export class DatabaseFactory extends EventEmitter {
        constructor(client: Client, options: { dbURI: string; });

        public readonly client: Client;
        public m: Mongoose;
        public schemas: Collection<string, ISchema>;
        public dbURI: string;
        public getSchema(name: string): ISchema;
        public getCollection(name: string): MongooseCollection;
        public start(): Promised;
        public registerSchemas(): Promised;
        public on(event: string, listener: Function): this;
        public on(event: 'database:connect', listener: () => void): this;
        public on(event: 'database:exception', listener: (error: Error) => void): this;
    }
    export class MessageCollector {
        constructor(client: Client);

        public collectors: {};
        public awaitMessages(filter: MessageFilter, options: MessageCollectorOptions): PromisedMessage;
    }
    export class Command {
        constructor(client: Client, info: CommandInfo);

        public readonly client: Client;
        public command: string;
        public description: string;
        public usage?: string;
        public category: string;
        public aliases: string[];
        public checks: ICommandChecks;
        public run(msg: CommandMessage): Promised;
    }
    export class Event {
        constructor(client: Client, info: EventInfo);

        public readonly client: Client;
        public event: string;
        public emitter: IEmitter;
        public run(...args: any[]): Promised;
    }
    export class CommandMessage {
        constructor(client: Client, message: Message, args: string[]);

        public readonly client: Client;
        public message: Message;
        public args: string[];
        public guild: Guild;
        public sender: User;
        public collector: MessageCollector;
        public reply(content: string): PromisedMessage;
        public embed(content: EmbedOptions): PromisedMessage;
    }
    export class Scheduler {
        constructor(client: Client, info: SchedulerInfo);

        public readonly client: Client;
        public name: string;
        public interval: number;
        public run(): Promised;
    }
    export class ISchema {
        constructor(name: string, definitions: SchemaDefinition);

        public name: string;
        public definitions: SchemaDefinition;
        public instance: Schema;
        public add(): this;
        public create(obj: any): Schema;
    }
    export class CommandManager {
        constructor(client: Client);

        public readonly client: Client;
        public commands: Collection<string, Command>;
        public processor: CommandProcessor;
        public registerCommand(c: Command): Promised;
    }
    export class EventManager {
        constructor(client: Client);

        public readonly client: Client;
    }
    export class SchedulerManager {
        constructor(client: Client);

        public readonly client: Client;
        public schedulers: Collection<string, Scheduler>;
        public registerScheduler(s: Scheduler): Promised;
    }
    export class CommandProcessor {
        constructor(client: Client);

        public readonly client: Client;
    }
    export class EventProcessor {
        constructor(client: Client);

        public readonly client: Client;
    }
    export class SchedulerProcessor {
        constructor(client: Client);

        public readonly client: Client;
    }
    export class RESTClient {
        constructor(client: Client);

        public getRole(query: string, guild: Guild): PromisedRole;
        public getChannel(query: string, guild: Guild): PromisedChannel;
        public getMessage(channelID: string, messageID: string): PromisedMessage;
        public getGuildEmojis(guild: Guild, len?: number): string;
        public getUser(query: string): PromisedUser;
        public getGuild(query: string): PromisedGuild;
    }

    export type IClientOptions = {
        token: string;
        prefix: string;
        owners: string[];
        commands: { path: string; };
        events: { path: string; };
        schemas: string;
        schedulers?: { enabled: boolean; path: string; };
        clientOptions?: ClientOptions;
    };
    export type MessageCollectorOptions = {
        channelID: string;
        userID: string;
        timeout?: number;
    };
    export type CommandInfo = {
        command: string;
        description: string;
        usage?: string;
        category?: string;
        aliases?: string[];
        checks?: ICommandChecks;
    };
    export type ICommandChecks = {
        guild?: boolean;
        owner?: boolean;
        disabled?: boolean;
        nsfw?: boolean;
    };
    export type EventInfo = {
        event: string;
        emitter: IEmitter;
    };
    export type SchedulerInfo = {
        name: string;
        interval: number;
    };
    export type MessageFilter = (msg: Message) => boolean;
    export type IEmitter = "client" | "commandManager" | "schedulerManager" | "database";
    export type Promised = Promise<void>;
    export type PromisedRole = Promise<Role>;
    export type PromisedMessage = Promise<Message>;
    export type PromisedGuild = Promise<Guild>;
    export type PromisedChannel = Promise<TextChannel | CategoryChannel | VoiceChannel>;
    export type PromisedUser = Promise<User>;
}