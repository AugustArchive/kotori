const { Collection } = require('@maika.xyz/eris-utils');
const { readdir }    = require('fs');

module.exports = class LanguageManager {
    /**
     * Construct a new language manager
     * @param {import('../client')} client The client instance
     * @param {LanguageManagerOptions} options The additional options to add on to
     */
    constructor(client, options) {
        this.client   = client;
        this.options  = Object.assign({}, options);
        /** @type {Collection<import('../interfaces/language')>} */
        this.locales  = new Collection();
        /** @type {string[]} */
        this.localeMap = [];

        Object.freeze(this.options);
    }

    /**
     * Starts the process
     */
    start() {
        readdir(this.options.path, (error, files) => {
            if (error) this.client.logger.error(`  Unable to build languages:\n${error.stack}`);

            this.client.logger.info(`  Now building ${files.length} languages...`);
            files.forEach(f => {
                const Language = require(`${this.options.path}/${f}`);
                const language = new Language(this.client);

                this.locales.set(language.code, language);
                this.localeMap.push(`${language.flag} **${language.code}** (${language.completion} Completed)`);
                this.client.logger.info(`  Built the ${language.code} locale.`);
            });
        });
    }
}

/**
 * @typedef {Object} LanguageManagerOptions
 * @prop {string} path The path to initalize from
 */