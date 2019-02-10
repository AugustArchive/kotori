const { Language } = require('../../lib');

module.exports = class EnUSLanguage extends Language {
    constructor(client) {
        super(client, {
            code: 'en_US',
            full: 'English (United States)',
            flag: ':flag_us:',
            translator: '280158289667555328',
            completion: 100,
            map: {
                test: (emoji, locale) => `${emoji} **|** Locale \`${locale}\` works!`
            }
        });
    }
};