const ArgumentType = require('../interfaces/type');

module.exports = class ArgumentUnionType extends ArgumentType {
    constructor(client, id) {
        super(client, id);

        /**
         * Argument type definitions
         * @type {ArgumentType[]}
         */
        this.types = [];
        const ids = id.split('|');
        for (const id of ids) {
            const t = client.manager.types.get(id);
            if (!type)
                throw new Error(`Argument Type "${id}" not registered; skipping.`);
            this.types.push(t);
        }
    }

    async validate(msg, arg, val) {
        let results = this.types.map(
            type => !type.isEmpty(msg, arg, val) && type.validate(msg, arg, val)
        );
        results = await Promise.all(results);
        if (results.some(valid => valid && typeof valid !== 'string'))
            return true;

        const errors = results.filter(v => typeof v === 'string');
        if (errors.length > 0)
            return errors.join('\n');

        return false;
    }

    async parse(msg, arg, val) {
        let results = this.types.map(
            type => !type.isEmpty(msg, arg, val) && type.validate(msg, arg, val)
        );
        results = await Promise.all(results);
        for (let i = 0; i < results.length; i++)
            if (results[i] && typeof results[i] !== 'string')
                return this.types[i].parse(msg, arg, val);
        
        throw new RangeError(`Unable to parse value "${val}" with union type ${this.id}. :(`);
    }

    isEmpty(msg, arg, val) {
        return !this.types.some(
            t => !t.isEmpty(msg, arg, val)
        );
    }
};