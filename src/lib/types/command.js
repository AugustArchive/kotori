const ArgumentType = require('../interfaces/type');

module.exports = class CommandArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'command');
    }

    async validate(msg, arg, val) {
        const command = this.client.manager.commands.filter(s => s.command === val.toLowerCase());
        if (!command)
            return false;

        return true;
    }
    
    parse(msg, arg, val) {
        return this.client.manager.commands.filter(s => s.command === val)[0];
    }
};