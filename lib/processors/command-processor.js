const { stripIndents } = require('common-tags');
const { Collection }   = require('@maika.xyz/eris-utils');
const CommandContext   = require('../interfaces/context');
const GuildSettings    = require('../settings/guild-settings');

module.exports = class CommandProcessor {
    /**
     * Create a new CommandProcessor instance
     * @param {import('../client')} client The client
     */
    constructor(client) {
        /**
         * The client instance
         * @type {import('../client')}
         */
        this.client = client;

        /**
         * The ratelimits cache
         * @type {Collection<Collection<number>>}
         */
        this.ratelimits = new Collection();
    }

    /**
     * Processes the `messageCreate` event when it emits
     * @param {import('@augu/eris').Message} msg The message
     */
    async process(msg) {
        if (msg.author.bot || !this.client.ready) return;

        const guildSettings = new GuildSettings(this.client);
        const guild = await guildSettings.get(msg.guild.id);

        // if (guild['blacklist'].is) return msg.channel.createMessage(`${this.client.emojis['ERROR'] } **|** This guild is blacklisted from the owners for:\n**${guild['blacklist'].reason}`);

        let prefix = null;
        const mention = new RegExp(`^<@!?${this.client.user.id}> `).exec(msg.content);
        const prefixes = [this.client.prefix, `${mention}`, guild['prefix']];

        for (const p of prefixes) if (msg.content.startsWith(p)) prefix = p;
        if (!prefix) return;

        const args        = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift();
        const command     = this.client.manager.commands.filter((s) => s.command === commandName || s.aliases.includes(commandName));
        const context     = new CommandContext(this.client, msg, command[0], args);

        if (command.length > 0) {
            const cmd = command[0];
            if (cmd.guildOnly && context.guild.type === 1) return context.send(`${this.client.emojis['ERROR']} **|** You must be in a guild to execute the \`${cmd.command}\` command.`);
            if (cmd.ownerOnly && !this.client.owners.includes(context.author.id)) return context.send(`${this.client.emojis['ERROR']} **|** You cannot run the \`${cmd.command}\` command without being the developers.`);
            if (cmd.nsfw && !context.channel.nsfw) return context.send(`${this.client.emojis['ERROR']} **|** Cannot run the command \`${cmd.command}\` without being in an NSFW channel.`);

            // Ratelimits / Cooldowns system
            if (!this.ratelimits.has(cmd.command)) this.ratelimits.set(cmd.command, new Collection());
            const now        = Date.now();
            const timestamps = this.ratelimits.get(cmd.command);
            const throttle   = cmd.throttle * 1000;

            if (!timestamps.has(msg.author.id)) {
                timestamps.set(msg.author.id, now);
                setTimeout(() => timestamps.delete(msg.author.id), throttle);
            } else {
                const time = timestamps.get(msg.addReaction.id) + throttle;
                if (now < time) {
                    const left = (time - now) / 1000;
                    const mes  = left > 1? `${left.toFixed(0)} seconds`: `${left.toFixed(0)} second`;
                    return context.send(`${this.client.emojis['WARNING']} **|** Command \`${cmd.command}\` is on cooldown for another ${mes}.`);
                }
                timestamps.set(msg.author.id, now);
                setTimeout(() => timestamps.delete(msg.author.id), throttle);
            }

            try {
                await cmd.run(context);
            } catch(ex) {
                // Credit: discordjs/Commando
                const list = this.client.owners? this.client.owners.map((user, i) => {
                    const or    = (i === this.client.owners.length - 1 && this.client.owners.length> 1? 'or ': '');
                    const owner = this.client.users.get(user);
                    return `${or}${owner.username}#${owner.discriminator}`;
                }): '';

                context.send(stripIndents`
                    ${this.client.emojis['ERROR']} **|** Command \`${cmd.command}\` failed to run.
                    \`\`\`js
                    ${ex.message}
                    \`\`\`
                    Contact ${list || 'the bot owner'} to get it fixed.
                `);
                this.client.logger.error(`  An error occured while executing the ${cmd.command} command!\n${ex.stack}`);
            }
        }
    }
};