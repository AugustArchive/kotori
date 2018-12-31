const ArgumentType = require('../interfaces/type');

module.exports = class StringArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'string');
    }

    validate(msg, arg, val) {
        if (arg.oneOf && !arg.oneOf.includes(val.toLowerCase()))
            return false;

        if (arg.min !== null && (typeof arg.min !== 'undefined') && val.length < arg.min)
            return `Please keep the ${arg.label} above or equal to ${arg.min} characters.`;
        
        if (arg.max !== null && (typeof arg.max !== 'undefined') && val.length > arg.max)
            return `Please keep the ${arg.label} above or equal to ${arg.max} characters.`;

        return true;
    }

    parse(msg, arg, val) {
        return val;
    }
};