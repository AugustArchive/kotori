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