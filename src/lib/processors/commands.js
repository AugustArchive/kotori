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

        const guilds = this.client.database.getSchema('guilds');
        if (!guilds)
            guilds.create({ guildID: msg.channel.guild.id });

        let prefix;
        const mention = new RegExp(`^<@!?${this.client.user.id}> `).exec(msg.content);
        const prefixes = [this.client.prefix, `${mention}`, guilds.prefix];

        for (const re of prefixes)
            if (msg.content.startsWith(re))
                prefix = re;

        if (!prefix)
            return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift();
        const command = this.client.manager.commands.filter(c => c.command === commandName || c.aliases.includes(commandName));
        const ctx = new CommandMessage(this.client, msg, args);

        if (command.length > 0) {
            if (command[0].checks.guild && msg.channel.type === 1)
                return ctx.reply(`You must be in a guild to execute the \`${command[0].command}\` command.`);

            if (command[0].checks.owner && !this.client.owners.includes(ctx.sender.id))
                return ctx.reply(`You cannot run the \`${command[0].command}\` command because you're not the bot developers.`);

            if (command[0].checks.nsfw && !msg.channel.nsfw)
                return msg.reply(`You cannot run the \`${command[0].command}\` command because you're not in an NSFW channel.`);

            try {
                await command[0].run(ctx);
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
};