const CommandMessage = require('../interfaces/message');
const { stripIndents } = require('common-tags');

module.exports = class CommandProcessor {
    /**
     * The command processor to process commands
     * 
     * @param {import('../client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Process the messageCreate event
     * 
     * @param {import('eris').Message} msg The message
     */
    async process(msg) {
        if (msg.author.bot || !this.client.ready)
            return;

        const { instance: guilds } = this.client.database.getSchema('guilds');
        const { instance: users } = this.client.database.getSchema('users');

        if (!guilds) {
            const guild = new guilds({ guildID: msg.channel.guild.id });
            guild.save();
            guild = guilds;
        }

        if (!users) {
            const user = new users({ userID: msg.author.id });
            users.save();
            user = users;
        }

        let prefix;
        const mention = new RegExp(`^<@!?${this.client.user.id}> `).exec(msg.content);
        const prefixes = [this.client.prefix, `${mention}`, guild.prefix];

        for (const re of prefixes)
            if (msg.content.startsWith(re))
                prefix = re;

        if (!prefix)
            return;

        const cmdPattern = this.buildCommandPattern(prefix);
        const matches = cmdPattern.exec(msg.content);
        const argString = msg.content.substring(matches[1].length + (matches[2] ? matches[2].length : 0));
        let args = matches;
        const commandName = args.shift();
        const command = this.client.manager.commands.filter(c => c.command === commandName || c.aliases.includes(commandName));
        const ctx = new CommandMessage(this.client, msg, command[0]);

        if (command.length > 0) {
            if (command[0].checks.guild && msg.channel.type === 1)
                return ctx.reply(`You must be in a guild to execute the \`${command[0].command}\` command.`);

            if (command[0].checks.owner && !this.client.owners.includes(ctx.sender.id))
                return ctx.reply(`You cannot run the \`${command[0].command}\` command because you're not the bot developers.`);

            if (command[0].checks.nsfw && !msg.channel.nsfw)
                return msg.reply(`You cannot run the \`${command[0].command}\` command because you're not in an NSFW channel.`);

            if (!args && command[0].argsCollector) {
                const collected = command[0].argsCollector.args;
                const count = collected[collected.length - 1].infinite ? Infinity : collected.length;
                const provided = this.parseArguments(argString.trim(), count);

                const result = await command[0].argsCollector.obtain(ctx, provided);
                if (result.cancelled) {
                    if (result.prompts.length === 0)
                        return ctx.reply(stripIndents`
                            **Invalid command usage!**
                            Usage: \`${ctx.usage()}\`
                        `);
                }
                args = result.values;
            }

            if (!args)
                args = this.parseArgs(argString);

            try {
                await command[0].run(ctx, args);
            } catch(ex) {
                const or = this.client.owners ? this.client.owners.map((u, i) => {
                    const e = i.length === this.client.owners.length - 1 && owners.length > 1 ? 'or ' : '';
                    return `${e}${u.username}#${u.discriminator}`;
                }).join(this.client.owners.length > 2 ? ', ' : ' ') : '';

                return ctx.reply(stripIndents`
                    **Command \`${command[0].command}\` has failed to run!**
                    \`${ex.message}\`
                    Report the error message to \`${or || 'the bot owner'}\`.
                `);
            }
        }
    }

    /**
     * Parses the arguments
     * 
     * @param {string} argString The argument string
     * @param {number} argCount The argument count
     * @returns {string[]}
     */
    parseArguments(argString, argCount) {
        const re = /\s*(?:("|')([^]*?)\1|(\S+))\s*/g;
        const result = [];
        let match = [];
        argCount = argCount || argString.length;
        while(--argCount && (match = re.exec(argString))) 
            result.push(match[2] || match[3]);
        if(match && re.lastIndex < argString.length) {
            const re2 = allowSingleQuote ? /^("|')([^]*)\1$/g : /^(")([^]*)"$/g;
            result.push(argString.substr(re.lastIndex).replace(re2, '$2'));
        }
        return result;
    }

    /**
     * Builds the command pattern
     * 
     * @param {string} prefix The prefix to escape
     * @returns {RegExp}
     */
    buildCommandPattern(prefix) {
        const escaped = prefix.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        return new RegExp(`^(<@!?${this.client.user.id}>\\s+(?:${escaped}\\s*)?|${escaped}\\s*)([^\\s]+)`, 'i');
    }

    parseArgs(argString) {
        return argString.trim().replace(/^("|')([^]*)\1$/g, '$2');
    }
};