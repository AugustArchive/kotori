const ArgumentType = require('../interfaces/type');

module.exports = class IntegerArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'integer');
    }

    validate(msg, arg, val) {
        const int = Number.parseInt(val);
        if (Number.isNaN(int))
            return false;
        if (arg.oneOf && !arg.oneOf.includes(int))
            return false;
        if (arg.min !== null && (typeof arg.min !== 'undefined') && int < arg.min)
            return `Enter a number above or equal to ${arg.min}.`;
        if (arg.max !== null && (typeof arg.max !== 'undefined') && int > arg.max)
            return `Enter a number below or equal to ${arg.max}`;

        return true;
    }

    parse(msg, arg, val) {
        return Number.parseInt(val);
    }
};