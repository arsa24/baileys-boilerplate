#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import { pluginBot } from "./script/plugin.js";
import { caseBot } from "./script/case.js";
import { execSync } from "child_process";
import path from "path";
const main = async () => {
  try {
    console.log(chalk.blue("Welcome to the bot generator!"));
    const input = await inquirer.prompt([
      {
        name: "projectName",
        type: "input",
        message: "Project name:",
        default: "my-bot",
      },
      {
        name: "module",
        type: "list",
        message: "Choose module type",
        choices: ["Common JS", "ES Module"],
      },
      {
        name: "typeBot",
        type: "list",
        message: "Choose bot type",
        choices: ["Plugin", "Case"],
      },
      {
        name: "installPkg",
        type: "list",
        message: "Do yo want to install packages?",
        choices: ["Yes", "No"],
      },
    ]);
    const projectPath = path.join(process.cwd(), input.projectName);
    if (!fs.existsSync(input.projectName)) {
      fs.mkdirSync(input.projectName);
      console.log(chalk.green("Directory created:", input.projectName));
      if (input.typeBot === "Case") {
        console.log(chalk.green("Generating Case bot..."));
        caseBot(input.projectName, input.module);
      } else if (input.typeBot === "Plugin") {
        console.log(chalk.green("Generating Plugin bot..."));
        pluginBot(input.projectName, input.module);
      }
    } else {
      console.log(chalk.red("Error: directory already exists"));
      return;
    }
    const mdl = input.module === "Common JS" ? "commonjs" : "module";
    const pkg = JSON.stringify(
      {
        name: input.projectName,
        main: "main.js",
        type: mdl,
        scripts: {
          start: "node main.js",
          "use-pairing-code": "node main.js --use-code",
        },
        keywords: ["bot", "wa", "wabot", "whatsapp"],
        dependencies: {
          "@whiskeysockets/baileys": "^6.7.9",
          pino: "^9.5.0",
          readline: "^1.3.0",
          pm2: "^5.4.3",
        },
      },
      null,
      2
    );
    fs.writeFileSync(path.join(projectPath, "package.json"), pkg);
    console.log(chalk.green("package.json created"));
    if (input.installPkg === "Yes") {
      console.log(chalk.blue("Installing dependencies..."));
      execSync(
        "npm install",
        { cwd: projectPath, stdio: "inherit" },
        (err, stdout, stderr) => {
          if (err) {
            console.error(chalk.red("Error installing dependencies:", stderr));
          } else {
            console.log(chalk.green("Dependencies installed successfully!"));
          }
        }
      );
    }
    console.log("\nPlease Read the documentation first.");
  } catch (error) {
    console.error(chalk.red("Error:", error.message));
    console.error(error.stack);
  }
};
main();
