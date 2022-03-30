## Telegram Rate Limiter

dead simple rate limiter for telegram bots with typescript support.

can be used to limit the number of messages sent by a user, using a token bucket algorithm. works fine with both telegraf and Telegram-Bot-API packages.

Supported Drivers:

-   Memory ( development only )
-   Redis ( Production )

adding other drivers is not supported yet. ( will be soon )

## Install

```
yarn add @zarchi/rate-limit
```
or
```
npm install @zarchi-rate-limit
```

## usage example

```js
import { Limiter } from "@zarchi/rate-limit";

// init
const limiter = new Limiter("memory", {
    interval: 10,
    max: 5,
    driverOptions: {},
});

// Telegram-Bot-API example
bot.on("message", async (msg) => {
    try {
        const userId = msg.chat.id;
        limiter.limit(userId);
        bot.sendMessage(chatId, "Hello World!");
    } catch (e) {
        // catch rate limit errors
    }
});
```

## Options

`Limiter<K extends keyof driver>`

#### class Limiter (driver: `K`, options: `ILimiterOptions<driver[K]>`)

**driver** -> `memory` | `redis`

**ILimiterOptions** ->

```
{
    max: number;   // maximum number of messages allowed in the interval
    interval: number; // interval in minutes e.g -> 2
    driverOptions: T; // driver specific options
}
```

for example, in snipet below, a user can send maximum 100 messages in interval of 5 minutes. if the user sends more than 100 messages, the limiter will throw an error.

```js
const limiter = new Limiter("memory", {
    interval: 5,
    max: 100,
    driverOptions: {},
});
```

### Redis Driver

driver used in this packages is from [npm redis](https://www.npmjs.com/package/redis)

you can pass options used in redis package to rate limiter.

**[list of redis options](https://github.com/redis/node-redis/blob/HEAD/docs/client-configuration.md)**

```js
limiter = new Limiter("redis", {
    interval: 10,
    max: 5,
    driverOptions: {
        url: "redis://localhost:6379",
        name: "test",
        password: "test",
        legacyMode: false,
        // other options
    },
});
```
