# @maika.xyz/kotori <img src="https://augu.me/files/uxwa2k.png" width="400px" height="449px">

> :heart: **The core component of Maika**

## Credits

- [discordjs/Commando](https://github.com/discordjs/Commando) **~** Argument and ArgumentCollector codes

## Library: Event Codes

All of the event codes are basically `<class>:<any>:<...any>`

## Library: Implementation

Kotori is avaliable for all bots not just Maika. All you need is to download the library (npm i @maika.xyz/kotori or yarn add @maika.xyz/kotori) to your package.json manifest. This library's database runs on MongoDB, so you might wanna not use it or use it and install MongoDB.

```js
const { Client } = require('@maika.xyz/kotori');

new Client({
    token: '',
    prefix: '',
    paths: {
        commands: './commands',
        events: './events',
        schedulers: './schedulers',
        schemas: './schemas'
    }
}).start();
```

## License

> `@maika.xyz/kotori` is released under the [MIT](https://github.com/MaikaBot/Kotori/blob/master/LICENSE) license.

```
Copyright (c) 2018-present auguwu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```