# 0.2.4

- **Update typings from v0.2.3**

# 0.2.3

- **Update dependency `mongoose` to 5.4.14 (#9)**
- **Add `command` property to the command context**
- **Add more functionality to the argument parser**
  - **Added `has(index: number): boolean`**
  - **Removed `length`**
  - **Added resolvers (channel, guild, role, messages, etc..)**
- **Added `code` and `dm` properties to the command context (functions)**

# 0.2.2

- **Fix command process**
- **Change the embed color**

# 0.2.1

- **Removed `getGuildSettings()` & `getUserSettings()` with `CommandContext.guildSettings` and `CommandContext.userSettings`**
- **Replaced `map` with `language` in the Language constructor**
- **Added the guild setting's prefix in `getFormat()`**
- **Added `length(index: number)` in the argument constructor**
- **Update dependency mongoose to 5.4.13 (#8)**

# 0.2.0

- **Removed `Client#getUserSettings` & `Client#getGuildSettings`**
- **Added `CommandContext#getUserSettings` & `CommandContext#getGuildSettings**
- **Added Guild / User settings**
- **Fix constructor for `@maika.xyz/hideri`**

# 0.1.1

- **Fix a spelling bug in the language manager**
- **Fixed a bug where there isn't no database getter in the Client class**
- **Use `@augu/eris` 0.10.0**