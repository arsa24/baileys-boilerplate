import { sock } from "./connection.js";
import { Utils } from "./Utils.js";
import fs from "fs";
import path from "path";
import { bot } from "../../config.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export class CommandHandler {
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
    const defaultPrefix = bot.prefix;
    this.sock.ev.on("messages.upsert", async (msg) => {
      const ctx = new Utils(sock, msg);
      const commandFiles = this.readCommands(this.commandPath);
      for (const file of commandFiles) {
        const { default: command } = file.endsWith(".cjs")
          ? require(file)
          : await import(file);
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

      await this.sock.readMessages([key]);
    });
  }
}