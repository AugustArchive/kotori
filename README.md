<img src="" width="400px" height="449px" alt="Kotori Minami">

# Kotori
The core of Maika. 
The library requires MongoDB to be installed.

## Usage
```js
const Kotori = require('@maika.xyz/kotori');
const bot    = Kotori.create({
    token: '',
    prefix: '',
    commands: '',
    events: '',
    schedulers: '',
    options: {}
});

bot.start();
```