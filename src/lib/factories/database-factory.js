const mongoose = require('mongoose');
const { readdir } = require('fs');
const { EventEmitter } = require('events');
const { Collection } = require('@maika.xyz/eris-utils');
const ISchema = require('../interfaces/schema');

module.exports = class DatabaseFactory extends EventEmitter {
    /**
     * Construct the Database factory
     * 
     * @param {import('../client')} client The client
     * @param {DatabaseFactoryOptions} options The database factory options
     */
    constructor(client, options) {
        super();

        /**
         * The client
         * @type {import('../client')}
         */
        this.client = client;

        /**
         * The mongoose connection
         * @type {mongoose}
         */
        this.m = mongoose;

        /**
         * The schemas
         * @type {Collection<string, ISchema>}
         */
        this.schemas = new Collection();

        /**
         * The URI of the database
         * @type {string}
         */
        this.uri = options.uri;
    }

    /**
     * Gets the collection
     * 
     * @param {string} name The collection name
     * @returns {mongoose.Collection} The collection that Mongoose provides
     */
    getCollection(name) {
        return this.m.connection.collection(name);
    }

    /**
     * Gets a schema
     * 
     * @param {string} name The schema name
     * @returns {ISchema} The schema
     */
    getSchema(name) {
        return this.schemas.get(name);
    }

    /**
     * Create a new Collection
     * 
     * @param {string} name The schema name
     * @param {any} obj Anything for the schema
     * @returns {DatabaseFactory} The database factory for chaining
     */
    newCollection(name, obj) {
        const schema = this.getSchema(name);
        schema.create(obj);
        return this;
    }

    /**
     * Starts the database
     * 
     * @returns {void} nOOP
     */
    async start() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.uri, { useNewUrlParser: true });
        mongoose
            .connection
            .on('connected', () => this.emit('database:connected'))
            .on('error', (e) => this.emit('database:error', e));

        this.registerSchemas();
    }

    /**
     * Registers all of the schemas
     * 
     * @returns {void} nOOp
     */
    registerSchemas() {
        readdir(this.client.paths.schemas, (error, files) => {
            if (error)
                this.emit('database:schemaError', error);

            files.forEach(f => {
                const schema = require(`${this.client.paths.schemas}/${f}`);
                
                if (typeof schema === 'function')
                    schema = new schema();

                if (typeof schema.default === 'function')
                    schema = new schema.default();
                
                if (!(schema instanceof ISchema))
                    throw new SyntaxError("Unable to register schema; not an instance of Kotori.ISchema");   
                    
                this.emit('database:schemaRegistered', Schema);
            });
        });
    }
};

/**
 * @typedef {Object} DatabaseFactoryOptions
 * @prop {string} uri The mongodb uri
 */