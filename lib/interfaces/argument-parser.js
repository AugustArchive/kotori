module.exports = class ArgumentParser {
    /**
     * Creates a new argument parser instance
     * @param {string[]} args The arguments
     */
    constructor(args) {
        this.arguments = args;
    }

    /**
     * Gets the argument as an string
     * @param {number} index The index of the argument
     * @returns {string[]} The arguments
     */
    get(index) {
        return this.arguments[index];
    }

    /**
     * Checks if the argument is empty
     * @param {number} index The index to check
     * @returns {boolean} If it failed or not
     */
    isEmpty(index) {
        return !this.arguments[index];
    }

    /**
     * Gather the arguments
     * @param {string} [seperator=' '] The seperator
     * @returns {string} The joined arguments
     */
    gather(seperator = ' ') {
        return this.arguments.join(seperator? seperator: ' ');
    }

    /**
     * Removes the first element of the arguments
     */
    shift() {
        return this.arguments.shift();
    }
}