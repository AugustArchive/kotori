module.exports = class Language {
    /**
     * Construct a new Language interface
     * @param {import('../client')} client The client instance
     * @param {LanguageOptions} options The additional options
     */
    constructor(client, options) {
        this.client     = client;
        this.code       = options.code;
        this.flag       = options.flag;
        this.translator = options.translator;
        this.language   = options.language;
        this.completion = `${options.completion}%`;
    }

    /**
     * Translates the language
     * @param {string} term The term to fetch
     * @param {any[]} args Any arguments
     * @returns {string} The fetched term
     */
    translate(term, ...args) {
        // Credit: https://github.com/dirigeants/klasa/blob/master/src/lib/structures/Language.js#L21
        const value = this.language[term];
        switch (typeof value) {
            case 'function': return value(...args);
            case 'undefined': return `${this.client.emojis['ERROR']} **|** Key \`${term}\` from the \`${this.code}\` locale hasn't been translated.`;
            default: return value;
        }
    } 
};

/**
 * @typedef {Object} LanguageOptions
 * @prop {string} full The full locale name
 * @prop {string} code The ISO locale code
 * @prop {string} translator The translator's id
 * @prop {string} flag The flag of the locale
 * @prop {number} completion The completion percentage
 * @prop {{ [x: string]: string | LocaleSupplier }} language The locale itself
 * 
 * @typedef {(...args: any[]) => string} LocaleSupplier
 */