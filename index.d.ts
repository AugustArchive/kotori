// TypeScipt Typings for component: "@maika.xyz/kotori"
declare module '@maika.xyz/kotori' {
    import { Client, Message, Guild } from 'eris';
    import { Collection } from '@maika.xyz/eris-utils';
    import { Connection } from 'mongoose';

    export const version: string;
    export class MaikaClient extends Client {
        constructor();

        public manager: CommandManager;
        public events: EventManager;
        public schedulers: SchedulerManager;
        public database: DatabaseFactory;
        public rest: RESTClient;
        public cache: Collection<object>;
        public owners: string[];
        public prefix: string;
        // public logger: Wumpston.Logger;
        public getUptime(): string;
        public getStatistics(): MaikaStatistics;
        public start(): Promise<void>;
    }
}