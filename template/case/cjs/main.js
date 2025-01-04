const {
  makeWASocket,
  Browsers,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const P = require("pino");
const readline = require("readline");
const fs = require("fs");
const { Utils } = require("./lib");

async function connect() {
  fs.readdir("./state", (err, files) => {
    if (files < 0) {
      fs.rmdir("./state");
    }
  });
  try {
    const { state, saveCreds } = await useMultiFileAuthState("state");
    const { version, isLatest } = await fetchLatestBaileysVersion();

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
      setTimeout(async () => {
        input.question(
          `${"\nMasukkan nomor telepon (62xxxxxxxx)"}\n${"Nomor"}: `,
          async function (phoneNumber) {
            await sock.waitForConnectionUpdate((update) => !!update.qr);
            let code = await sock.requestPairingCode(
              phoneNumber.replace(/\D/g, "")
            );
            console.log(`\n${"Code"} : ${code.match(/.{1,4}/g)?.join("-")}\n`);
            input.close();
          }
        );
      }, 3000);
    }

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", (m) => {
      const { connection, lastConnection } = m;
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
