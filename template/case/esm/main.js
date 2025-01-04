import {
  makeWASocket,
  Browsers,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import P from "pino";
import readline from "readline";
import fs from "fs/promises";
import { Utils } from "./lib.js";

async function connect() {
  try {
    const files = await fs.readdir("./state").catch(() => []);
    if (files.length === 0) {
      await fs.rm("./state", { recursive: true, force: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState("state");
    const { version } = await fetchLatestBaileysVersion();

    const useCode = process.argv.includes("--use-code");
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const sock = makeWASocket({
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, P({ level: "fatal" })),
      },
      browser: Browsers.ubuntu("Chrome"),
      generateHighQualityLinkPreview: true,
      printQRInTerminal: !useCode,
      logger: P({ level: "fatal" }),
      version,
      defaultQueryTimeoutMs: 0,
      markOnlineOnConnect: true,
      syncFullHistory: false,
    });

    if (useCode && !sock.authState.creds.registered) {
      setTimeout(() => {
        input.question(
          "\nMasukkan nomor telepon (62xxxxxxxx)\nNomor: ",
          async (phoneNumber) => {
            await sock.waitForConnectionUpdate((update) => !!update.qr);
            const code = await sock.requestPairingCode(
              phoneNumber.replace(/\D/g, "")
            );
            console.log(`\nCode : ${code.match(/.{1,4}/g)?.join("-")}\n`);
            input.close();
          }
        );
      }, 3000);
    }

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", (m) => {
      const { connection } = m;
      if (connection === "close") {
        connect();
      } else if (connection === "open") {
        console.log("\nConnected successfully!");
      }
    });

    sock.ev.on("messages.upsert", async (msg) => {
      const ctx = new Utils(sock, msg);
      const trigger = await ctx.args();
      const cmd = trigger[0];
      //   command bot disimpan disini
      ctx.simulate("typing");
      switch (cmd.toLowerCase()) {
        case ".ping":
          ctx.reply("Pong");
          break;
        default:
          break;
      }
    });
  } catch (e) {
    console.error(e);
  }
}

connect();
