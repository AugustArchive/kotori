const { stripIndents } = require('common-tags');
const MessageCollector = require('./collector');

module.exports = class Argument {
    /**
     * Construct the Argument interface
     * 
     * @param {import('../client')} client The client
     * @param {ArgumentInfo} info The argument info to provide
     */
    constructor(client, info) {
        this.client = client;
        this.collector = new MessageCollector(client);
        this.label = info.label;
        this.prompt = info.prompt;
        this.default = (typeof info.default !== 'undefined' ? info.default : null);
        this.timeout = (info.time || 30);
        this.max = (typeof info.max !== 'undefined' ? info.max : null);
        this.min = (typeof info.max !== 'undefined' ? info.min : null);
        this.validator = (typeof info.validator !== 'undefined' ? info.validator : null);
        this.infinite = Boolean(info.infinite);
        this.oneOf = typeof info.oneOf !== 'undefined' ? info.oneOf : null;
    }

    /**
     * Obtain an argument
     * 
     * @param {import('./message')} msg The message
     * @param {string} value The value
     * @param {number} [promptLimit=Infinity] The prompt limit
     * @returns {Promise<IArgumentResult>} The promised argument result
     */
    async obtain(msg, value, promptLimit = Infinity) {
        let empty = this.isEmpty(msg, value);
        if (empty && this.default !== null)
            return {
                value: (typeof this.default === 'function' ? await this.default(msg, this) : this.default),
                cancelled: null,
                prompts: [],
                answers: []
            };
        if (this.infinite)
            return this.obtainInfinite(msg, value, promptLimit);

        const wait = this.timer > 0 && this.timer !== Infinity ? (this.timer) * 1000 : undefined;
        const prompts = [];
        const answers = [];
        let valid = !empty ? await this.validate(msg, val) : false;

        while (!valid || typeof valid === 'string') {
            if(prompts.length >= promptLimit)
                return {
                    value: null,
                    cancelled: 'Prompt limit exceeded.',
                    prompts,
                    answers
                };

            prompts.push(await msg.reply(stripIndents`
                ${empty ? this.prompt.start : valid ? valid : this.prompt.retry}
                Respond with \`cancel\` to cancel the command.
                ${wait ? `This prompt will automatically be cancelled in ${this.wait} seconds.` : ''}
            `));

            const collected = await this.collector.awaitMessage((result) => result.author.id === msg.sender.id, {
                channelID: msg.channel.id,
                userID: msg.sender.id,
                timeout: wait
            });

            if (collected) {
                answers.push(collected);
                value = answers[answers.length - 1].content;
            } else return {
                value: null,
                cancelled: 'Sender didn\'t respond in time.',
                prompts,
                answers
            };

            let v = value.toLowerCase();
            if (v === 'finish')
                return {
                    value: results.length > 0 ? results : null,
                    cancelled: this.default ? null : results.length > 0 ? null : 'User finished the entry.',
                    prompts,
                    answers
                };
            if (v === 'cancel')
                return {
                    value: null,
                    cancelled: 'User cancelled prompt.',
                    prompts,
                    answers
                };

            empty = this.isEmpty(msg, value);
            valid = await this.validate(msg, value);
        }

        return {
            value: await this.parse(msg, val),
            cancelled: null,
            prompts,
            answers
        };
    };

    /**
     * Obtain an infinite argument
     * 
     * @param {import('./message')} msg The message
     * @param {string} value The value
     * @param {number} [promptLimit=Infinity] The prompt limit
     * @returns {Promise<IArgumentResult>} The promised argument result
     */
    async obtainInfinite(msg, values, promptLimit = Infinity) {
        let results = [];
        let prompts = [];
        let answers = [];
        let current = 0;
        let wait = this.timer > 0 && this.timer !== Infinity ? (this.timer) * 1000 : undefined;

        while(true) {
            let value = values && values[current] ? values[current] : null;
            let valid = value ? await this.validate(msg, val) : false;
            let attempts = 0;
            while (!valid || typeof valid === 'string') {
                attempts++;
                if (attempts > promptLimit)
                    return {
                        value: null,
                        cancelled: 'Prompt limit exceeded.',
                        prompts,
                        answers
                    };

                if (value) {
                    prompts.push(await msg.reply(stripIndents`
                        ${valid ? valid : this.prompt.retry}
                        Respond with \`cancel\` to automatically cancel the command or respond with \`finish\` to finish the entry.
                        ${wait ? `This will automatically cancel in ${this.wait} seconds!` : ''}
                    `));
                } else if (results.length === 0) {
                    prompts.push(await msg.reply(stripIndents`
                        ${this.prompt.start}
                        Respond with \`cancel\` to automatically cancel the command or respond with \`finish\` to finish the entry.
                        ${wait ? `This will automatically cancel in ${this.wait} seconds!` : ''}
                    `));
                }

                const collected = await this.collector.awaitMessage((result) => result.author.id === msg.sender.id, {
                    channelID: msg.channel.id,
                    userID: msg.sender.id,
                    timeout: wait
                });

                if (collected) {
                    answers.push(collected);
                    value = answers[answers.length - 1].content;
                } else return {
                    value: null,
                    cancelled: 'Sender didn\'t respond in time.',
                    prompts,
                    answers
                };

                let v = value.toLowerCase();
                if (v === 'finish')
                    return {
                        value: results.length > 0 ? results : null,
                        cancelled: this.default ? null : results.length > 0 ? null : 'User finished the entry.',
                        prompts,
                        answers
                    };
                if (v === 'cancel')
                    return {
                        value: null,
                        cancelled: 'User cancelled prompt.',
                        prompts,
                        answers
                    };

                valid = await this.validate(msg, value);
            }

            results.push(await this.parse(msg, value));
            if (values) {
                current++;
                if (current === values.length)
                    return {
                        value: results,
                        cancelled: null,
                        prompts,
                        answers
                    };
            }
        }
    }

    /**
     * The empty checker
     * 
     * @param {import('./message')} msg The message
     * @param {string} val The value
     * @returns {boolean} if the type was empty
     */
    isEmpty(msg, val) {
        return (this.type ? this.type.isEmpty(msg, val) : !val);
    }

    /**
     * Parses the string for a value
     * 
     * @param {import('./message')} msg The message
     * @param {string} val The value
     * @returns {idk = null}
     */
    parse(msg, val) {
        return this.type.parse(msg, val);
    }

    /**
     * Validates the argument
     * 
     * @param {import('./message')} msg The message
     * @param {string} val The value
     * @returns {Promise<string>}
     */
    validate(msg, val) {
        const valid = (this.validator ? this.validator(msg, this, val) : this.type.validate(msg, this, val));
        if (!valid || typeof valid === 'string')
            return this.prompt.retry || valid;
        if (valid instanceof Promise)
            return valid.then(v => !v || typeof v === 'string' ? this.prompt.retry || v : v);
        return valid;
    }

    /**
     * Obtains the type that the argument wants
     * 
     * @param {string} type The argument type
     * @returns {import('./type')} The type received
     */
    obtainType(type) {
        if (!type)
            return null;
        if (!id.includes('|'))
            return this.client.manager.types.get(type);

        let t = this.client.manager.types.get(type);
        if (t)
            return t;
        t = new (require('./type')(this.client, type));
        this.client.manager.registerType(t);
        return t;
    }
};

/**
 * @typedef {Object} ArgumentInfo
 * @prop {string} label The label
 * @prop {IArgumentPrompt} [prompt] The prompts
 * @prop {any} [default] Makes the argument optional - cannot be null
 * @prop {number} [time] The time of wait
 * @prop {number} [max] The max of "x"
 * @prop {number} [min] The min of "y"
 * @prop {Function} [validator] The validator
 * @prop {boolean} [infinite] If the argument is infinite
 * @prop {string[]} [oneOf] One of anything (Can return one of the array's object)
 */

/**
 * @typedef {import('./collectors/argument').ArgumentCollectorInfo} IArgumentResult
 */

/**
 * @typedef {Object} IArgumentPrompt
 * @prop {string} start The start of the argument
 * @prop {string} retry The retry prompt, when it fails / wrong result.
 */