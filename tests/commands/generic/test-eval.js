const Kotori = require('../../../lib');

module.exports = class TestEvalCommand extends Kotori.Command {
    constructor(client) {
        super(client, {
            command: 'testeval',
            description: 'Evals anything.',
            usage: '<script:string>',
            ownerOnly: true
        });
    }

    async run(ctx) {
        if (ctx.args.isEmpty(0)) {
            const usage = this.getFormat();
            return ctx.send(`${this.client.emojis['ERROR']} **|** Invalid usage. \`${usage}\`.`);
        }

        const script = ctx.args.gather(' ');
        const result = await eval(script);
        ctx.send(`\`\`\`js\n${result}\`\`\``);
    }
}