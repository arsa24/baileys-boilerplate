import { CommandHandler } from "./src/lib/CommandHandler.js";
import { conn, sock } from "./src/lib/connection.js";
import path from "path";

const main = async () => {
  await conn();
  const cmd = new CommandHandler(sock, path.resolve("./src/plugin"));
  cmd.load();
};

main();
