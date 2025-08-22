const { spawn } = require("child_process");
const http = require("http");
const axios = require("axios");
const logger = require("./utils/log");

// Safety Lock
if (global.botAlreadyRunning) {
  console.log("Bot already running. Exiting...");
  process.exit(0);
}
global.botAlreadyRunning = true;
global.countRestart = 0;

// Dashboard server for uptime
const dashboard = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("SAGOR BOT CONNECTED TO FACEBOOK SUCCESSFULLY");
});

const PORT = process.env.PORT || 3000;
dashboard.listen(PORT, () => logger(`Dashboard running on port ${PORT}`, "[ Starting ]"));

// Start bot function
function startBot(message) {
  if (message) logger(message, "[ Starting ]");

  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Sagor.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (codeExit) => {
    // Auto restart if crashed
    if ((codeExit !== 0 || global.countRestart < 5) && global.countRestart < 5) {
      global.countRestart += 1;
      startBot("Restarting...");
    }
  });

  child.on("error", (error) => {
    logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
  });
}

// Check updates from Github
axios.get("https://raw.githubusercontent.com/Uzi-SaGor-01/sagor-x-mirai/main/package.json")
  .then((res) => {
    logger(res.data.name, "[ NAME ]");
    logger("Version: " + res.data.version, "[ VERSION ]");
    logger(res.data.description, "[ DESCRIPTION ]");
  })
  .catch((err) => {
    logger("Failed to fetch GitHub update info: " + err.message, "[ ERROR ]");
  });

// Start bot
startBot();
