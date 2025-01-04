import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const pluginBot = async (pathBot, module) => {
  let main = "";
  let utils = "";
  let handler = "";
  let config = "";
  let connection = "";
  let example = "";
  const configPath = path.resolve(
    __dirname,
    "../template/plugin/cjs/config.js"
  );
  if (module === "Common JS") {
    const mainPath = path.resolve(__dirname, "../template/plugin/cjs/main.js");
    const utilsPath = path.resolve(
      __dirname,
      "../template/plugin/cjs/utils.js"
    );
    const handlerPath = path.resolve(
      __dirname,
      "../template/plugin/cjs/handler.js"
    );
    const connectionPath = path.resolve(
      __dirname,
      "../template/plugin/cjs/connection.js"
    );
    const examplePath = path.resolve(
      __dirname,
      "../template/plugin/cjs/examplePlugin.js"
    );
    try {
      main = fs.readFileSync(mainPath, "utf8");
      utils = fs.readFileSync(utilsPath, "utf8");
      handler = fs.readFileSync(handlerPath, "utf8");
      config = fs.readFileSync(configPath, "utf8");
      connection = fs.readFileSync(connectionPath, "utf8");
      example = fs.readFileSync(examplePath, "utf8");
    } catch (err) {
      console.error("Error:", err.message);
    }
  } else if (module === "ES Module") {
    const mainPath = path.resolve(__dirname, "../template/plugin/esm/main.js");
    const utilsPath = path.resolve(
      __dirname,
      "../template/plugin/esm/utils.js"
    );
    const handlerPath = path.resolve(
      __dirname,
      "../template/plugin/esm/handler.js"
    );
    const connectionPath = path.resolve(
      __dirname,
      "../template/plugin/esm/connection.js"
    );
    const examplePath = path.resolve(
      __dirname,
      "../template/plugin/esm/examplePlugin.js"
    );
    try {
      main = fs.readFileSync(mainPath, "utf8");
      utils = fs.readFileSync(utilsPath, "utf8");
      handler = fs.readFileSync(handlerPath, "utf8");
      config = fs.readFileSync(configPath, "utf8");
      connection = fs.readFileSync(connectionPath, "utf8");
      example = fs.readFileSync(examplePath, "utf8");
    } catch (err) {
      console.error("Error:", err.message);
    }
  }
  fs.writeFileSync(`${pathBot}/main.js`, main);
  fs.writeFileSync(`${pathBot}/config.js`, config);
  const libPath = path.join(pathBot, "src", "lib");
  fs.mkdirSync(libPath, { recursive: true });
  fs.writeFileSync(`${libPath}/CommandHandler.js`, handler);
  fs.writeFileSync(`${libPath}/connection.js`, connection);
  fs.writeFileSync(`${libPath}/Utils.js`, utils);

  const plugins = ["test", "downloader", "tools", "owners"];
  plugins.forEach((plugin) => {
    fs.mkdirSync(`${pathBot}/src/plugin/${plugin}`, { recursive: true });
  });

  fs.writeFileSync(`${pathBot}/src/plugin/test/ping.js`, example);
};
