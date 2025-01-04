import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const caseBot = async (pathBot, module) => {
  let main = "";
  let lib = "";

  if (module === "Common JS") {
    const mainPath = path.resolve(__dirname, "../template/case/cjs/main.js");
    const libPath = path.resolve(__dirname, "../template/case/cjs/lib.js");

    try {
      main = fs.readFileSync(mainPath, "utf8");
      lib = fs.readFileSync(libPath, "utf8");
    } catch (err) {
      console.error("Error:", err.message);
    }
    fs.writeFileSync(`${pathBot}/main.js`, main);
    fs.writeFileSync(`${pathBot}/lib.js`, lib);
  } else {
    const mainPath = path.resolve(__dirname, "../template/case/esm/main.js");
    const libPath = path.resolve(__dirname, "../template/case/esm/lib.js");
    try {
      main = fs.readFileSync(mainPath, "utf8");
      lib = fs.readFileSync(libPath, "utf8");
    } catch (err) {
      console.error("Error:", err.message);
    }
    fs.writeFileSync(`${pathBot}/main.js`, main);
    fs.writeFileSync(`${pathBot}/lib.js`, lib);
  }
};
