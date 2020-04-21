const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");

PORT_NUM = "8000";

// global reference to prevent garbage collection
let win;

function createWindow() {
  // python subprocess
  // TODO

  // bring python to the current dir
  var djangoServer = spawn("./venv/bin/python", [
    "./aayu/manage.py",
    "runserver"
  ]);

  djangoServer.stdout.on("data", data => {
    // console.error(`stdout: ${data}`);
  });

  djangoServer.stderr.on("data", data => {
    // console.error(`stderr: ${data}`);
  });

  var mainAddress = "http://localhost:8000";

  var openWindow = function() {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      minWidth: 1281,
      minHeight: 800,
      backgroundColor: "#ddd",
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    });

    // load index.html
    // win.loadFile('index.html')

    // load via url
    // win.loadURL("http://github.com");
    win.loadURL(mainAddress);

    win.once("ready-to-show", () => {
      win.show();
      // manual reload was necessary to load from localhost
      // which was not the same for domains like github, electron
      setTimeout(() => {
        win.reload();
      }, 1500);
    });
  };

  openWindow();

  win.on("closed", function() {
    win = null;
    djangoServer.kill("SIGINT");
  });

  // rq(mainAddress).then(htmlString => openWinow());
}

app.on("ready", createWindow);

app.on("window-all-closed", app.quit);

app.on("before-quir", function() {
  console.log("About to quit!");
});
