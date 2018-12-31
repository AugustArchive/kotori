const { model, Schema } = require('mongoose');

module.exports = class ISchema {
    /**
     * The schema interface
     * 
     * @param {SchemaInfo} info The info
     */
    constructor(info) {
        this.name = info.name;
        this.definitions = info.definitions;
        this.instance = new Schema(this.definitions);
    }

    /**
     * Adds the schema
     * @returns {ISchema} The Schema instance for chaining
     */
    add() {
        model(this.name, this.instance);
        return this;
    }

    /**
     * Create a new Schema for chaining I guess?
     * 
     * @param {any} obj The object to add to the schema
     * @returns {ISchema} This instance for chaining?
     */
    create(obj) {
        const s = new this.instance(obj);
        s.save();
        return this;
    }
};

/**
 * @typedef {Object} SchemaInfo
 * @prop {string} name The collection name for mongoose
 * @prop {import('mongoose').SchemaDefinition} definitions The mongoose schema definitions
 */