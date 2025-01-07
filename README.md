# Baileys Boilerplate

Boilerplate for Baileys Whatsapp bot

# Usage

```sh
npx baileys-boilerplate
```

# Type Bot

This boilerplate has two types of options for the bot. namely Case Type and Plugin Type

## Plugin

All bot commands are stored in the `plugin/` sub directory according to the type of command e.g. `downloads` for the downloader command. You can also add your own command categories. Example commands for this type:

### Module (ESM)

```js
export default {
  name: "Ping", // Command name
  triggers: ["ping", "p"], //Trigger (Can be more than one)
  code: async (ctx) => {
    //the content of the command
    ctx.reply("pong"); // Command to reply to a message
  },
};
```

### Common (CJS)

```js
module.exports = {
  name: "Ping", // Command name
  triggers: ["ping"], //Trigger (Can be more than one)
  code: async (ctx) => {
    //the content of the command
    ctx.reply("pong"); // Command to reply to a message
  },
};
```

## Case

This type uses a switch case to handle incoming commands. to add commands, simply add a new case. For example:

```js
switch (cmd.toLowerCase()) {
  case ".ping":
    ctx.reply("Pong");
    break;
  default:
    break;
}
```

You only need to add the case:

```js
case "hi":
	ctx.reply("Hi, how can I help you?");
	break;
```

For commands that want to have multiple triggers you can do this:

```js
case "hello", "hi":
	ctx.reply("Hi, how can I help you?");
	break;
```

# Running Bot

There are a couple of options to run this Bot, namely using QRCode and Pairing Code. Here is how to run it:

## Connect with QR Code

```sh
npm start
```

## Connect with Pairing Code

```sh
npm run use-pairing-code
```

## License

This package is licensed under the MIT License.
