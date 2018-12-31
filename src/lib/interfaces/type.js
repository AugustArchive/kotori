module.exports = class ArgumentType {
    /**
     * Create a new ArgumentType interface
     * 
     * @param {import('../client')} client The bot client
     * @param {string} id The type ID
     */
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }

    /**
     * Validates a value string against the type
     * 
     * @param {import('./message')} msg The command message
     * @param {import('./argument')} arg The argument
     * @param {string} val The value
     * @returns {boolean|string|Promise<boolean|string>} If the value is the actual value
     */
    validate(msg, arg, val) {
        throw new SyntaxError(`Argument Type "${this.id}" didn't provide a validate(msg: Kotori.CommandMessage, arg: Kotori.Argument, val: string) function.`);
    }

    /**
     * Parses the raw value string into a usable value
     * 
     * @param {import('./message')} msg The command message
     * @param {import('./argument')} arg The argument
     * @param {string} val The value
     * @returns {any|Promise<any>} The usable value
     */
    parse(msg, arg, val) {
        throw new SyntaxError(`Argument Type "${this.id}" didn't provide a parse(msg: Kotori.CommandMessage, arg: Kotori.Argument, val: string) function.`);
    }

    /**
     * Checks if "x" is empty or not
     * 
     * @param {import('./message')} msg The command message
     * @param {import('./argument')} arg The argument
     * @param {string} val The value
     * @returns {boolean} If x is not empty
     */
    isEmpty(msg, arg, val) {
        if (Array.isArray(val))
            return val.length === 0;

        return !val;
    }
};