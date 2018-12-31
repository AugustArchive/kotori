const ArgumentType = require('../interfaces/type');

module.exports = class FloatArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'float');
    }

    validate(msg, arg, val) {
        const float = Number.parseFloat(val);
        if (Number.isNaN(float))
            return false;
        if (arg.oneOf && !arg.oneOf.includes(float))
            return false;
        if (arg.min !== null && (typeof arg.min !== 'undefined') && float < arg.min)
            return `Enter a number above or equal to ${arg.min}.`;
        if (arg.max !== null && (typeof arg.max !== 'undefined') && float > arg.max)
            return `Enter a number below or equal to ${arg.max}`;

        return true;
    }

    parse(msg, arg, val) {
        return Number.parseFloat(val);
    }
};