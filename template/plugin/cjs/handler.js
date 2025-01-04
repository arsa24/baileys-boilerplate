const { sock } = require("./connection");
const { Utils } = require("./Utils");
const fs = require("fs");
const path = require("path");
const { bot } = require("../../config");

class CommandHandler {
  constructor(sock, commandPath) {
    this.sock = sock;
    this.commandPath = commandPath;
  }

  readCommands(dir) {
    const files = [];
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...this.readCommands(fullPath));
      } else if (file.endsWith(".js") || file.endsWith(".cjs")) {
        files.push(fullPath);
      }
    });
    return files;
  }

  async load() {
    const sock = await this.sock
    const defaultPrefix = bot.prefix;
    sock.ev.on("messages.upsert", async (msg) => {
      const ctx = new Utils(sock, msg);
      const commandFiles = this.readCommands(this.commandPath);
      for (const file of commandFiles) {
        const command = file.endsWith(".cjs")
          ? require(file)
          : await import(file).then((module) => module.default);
        if (!command?.triggers) continue;
        const commandPrefixes = command.prefix
          ? [command.prefix]
          : defaultPrefix;
        for (const trigger of command.triggers) {
          const message = await ctx.getMessages();
          if (typeof message === "string") {
            for (const prefix of commandPrefixes) {
              if (
                message.toLowerCase().startsWith(prefix + trigger.toLowerCase())
              ) {
                ctx.simulate("typing");
                return command.code(ctx);
              }
            }
          }
        }
      }

      const key = {
        remoteJid: msg.messages[0].key.remoteJid,
        id: msg.messages[0].key.id,
        participant: msg.messages[0].key.participant,
      };

      await sock.readMessages([key]);
    });
  }
}

module.exports = { CommandHandler };
