module.exports = class RESTClient {
    /**
     * Construct the REST client for getting Discord objects
     * @param {import('../client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Resolves a Discord role
     * @param {string} query The role name/mention/id
     * @param {import('@augu/eris').Guild} guild The guild
     * @returns {Promise<import('@augu/eris').Role>} The role found
     */
    getRole(query, guild) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const role = guild.roles.get(query);
                if (role) return resolve(query);
            } else if (/<@%(\d+)>$/.test(query)) {
                const match = query.match(/^<@&(\d+)>$/);
                const role  = guild.roles.get(match[1]);
                if (role) return resolve(query);
            } else {
                const roles = guild.roles.filter((role) => role.name.toLowerCase().includes(query.toLowerCase()));
                if (roles.length > 0) return resolve(roles[0]);
            }
            reject();
        });
    }

    /**
     * Resolves a Discord user
     * @param {string} query The query
     * @returns {Promise<import('@augu/eris').User>} The user that was found
     */
    getUser(query) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const user = this.client.users.get(query);
                if (user) return resolve(user);
            } else if (/^<@!?(\d+)>$/.test(query)) {
                const match = query.match(/^<@!?(\d+)>$/);
                const user = this.client.users.get(match[1]);
                if (user) return resolve(user);
            } else if (/^(.+)#(\d{4})$/.test(query)) {
                const match = query.match(/^(.+)#(\d{4})$/);
                const users = this.client.users.filter((user) => user.username === match[1] && Number(user.discriminator) === Number(match[2]));
                if (users.length > 0) return resolve(users[0]);
            } else {
                const users = this.client.users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
                if (users.length > 0) return resolve(users[0]);
            }
            reject();
        });
    }

    /**
     * Resolves a Discord guild
     * @param {string} query The query
     * @returns {import('@augu/eris').Guild} The guild
     */
    getGuild(query) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const guild = this.client.guilds.get(query);
                if (guild) return resolve(guild);
            } else {
                const guilds = this.client.guilds.filter((guild) => guild.name.toLowerCase().includes(query.toLowerCase()));
                if (guilds.length > 0) return resolve(guilds[0]);
            }

            reject();
        });
    }

    /**
     * Resolves a Discord "text"/"voice"/"category" channel
     * @param {string} query The query
     * @param {import('@augu/eris').Guild} guild The guild
     * @returns {Promise<import('@augu/eris').TextChannel|import('@augu/eris').VoiceChannel|import('@augu/eris').CategoryChannel>} The channel
     */
    getChannel(query, guild) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                if (guild) {
                    if (!guild.channels.has(query)) reject();
                    resolve(guild.channels.get(query));
                } else {
                    const channel = channel in this.client.channelGuildMap && this.client.guilds.get(this.client.channelGuildMap[query]).channels.get(query);
                    if (channel) return resolve(channel);
                }
            } else if (/^<#(\d+)>$/.test(channel)) {
                const match = query.match(/^<#(\d+)>$/);
                if (guild) {
                    if (!guild.channels.has(match[1])) reject();
                    resolve(guild.channels.get(match[1]));
                } else {
                    const channel = match[1] in this.client.channelGuildMap && this.client.guilds.get(this.client.channelGuildMap[match[1]]).channels.get(query);
                    if (channel) return resolve(channel);
                }
            } else if (guild) {
                const channel = guild.channels.filter((channel) => channel.name.toLowerCase().includes(query.toLowerCase()));
                if (channel.length > 0) return resolve(channel[0]);
            } 
      
            reject();
        });
    }

    /**
     * Resolves a Discord message
     * @param {string} channelID The channel ID that the message is from
     * @param {string} messageID The message ID to find
     * @returns {Promise<import('@augu/eris').Message>} The message
     */
    getMessage(channelID, messageID) {
        return new Promise(async(resolve, reject) => {
            try {
                const message = await this.client.getMessage(channelID, messageID);
                resolve(message);
            } catch(ex) {
                reject('Unknown Message ID.');
            }
        });
    }
}