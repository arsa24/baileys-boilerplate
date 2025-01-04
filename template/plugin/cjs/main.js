const { CommandHandler } = require("./src/lib/CommandHandler");
const { conn } = require("./src/lib/connection");
const path = require("path");

const main = async () => {
  const sock = await conn();
  const cmd = new CommandHandler(sock, path.resolve("./src/plugin"));
  await cmd.load();
};

main().catch((err) => console.error("Error in main:", err));
