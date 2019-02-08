module.exports = class Util {
    /**
     * Checks if `x` is a function.
     * @param {Function} x The function
     * @returns {boolean} If it is or not
     */
    static isFunction(x) {
        return typeof x === 'function';
    }
};