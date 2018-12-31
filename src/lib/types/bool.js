const ArgumentType = require('../interfaces/type');

module.exports = class BooleanArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'bool');

        this.true = new Set(
            ['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']
        );
        this.false = new Set(
            ['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']
        );
    }

    validate(x, y, val) {
        const l = val.toLowerCase();
        return this.true.has(l) || this.false.has(l);
    }

    parse(x, y, val) {
        const l = val.toLowerCase();
        if (this.true.has(l))
            return true;
        if (this.false.has(l))
            return false;
        throw new RangeError(`Unknown bool value: "${l}"`);
    }
};