const {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const P = require("pino");

let sock;

const conn = async () => {
  try {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState("state");
    const useCode = process.argv.includes("--use-code");
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("Connecting to WhatsApp...");

    sock = makeWASocket({
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

    sock.ev.on("connection.update", (m) => {
      const { connection, lastDisconnect } = m;
      if (connection === "close") {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut;
        console.log(
          `Connection closed. Reason: ${
            lastDisconnect?.error ? lastDisconnect.error.message : "Unknown"
          }`
        );
        if (shouldReconnect) {
          conn();
        } else {
          console.log("Logged out, please restart the bot.");
          process.exit(0);
        }
      } else if (connection === "open") {
        console.log("\nConnected successfully!");
      }
    });
    sock.ev.on("creds.update", saveCreds);
    return sock;
  } catch (error) {
    console.error(`Error connecting: ${error.message}`);
    setTimeout(conn, 5000);
  }
};

module.exports = { conn };
