const ArgumentType = require('../interfaces/type');

module.exports = class RoleArgumentType extends ArgumentType {
    constructor(client) {
        super(client, 'role');
    }

    async validate(msg, arg, val) {
        const role = await this.client.rest.getRole(val);
        if (!role)
            return false;

        return true;
    }

    async parse(msg, arg, val) {
        return await this.client.rest.getRole(val); 
    }
};