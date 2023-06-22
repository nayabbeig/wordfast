const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { runServer } = require("./webpack.dev.config");
const { getParagraph } = require("./electronSrc/words");

async function createWindow() {
  await runServer();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      // color of titile bar
      color: "#191A19",
      // color of titile bar control
      symbolColor: "#74b1be",
      // height of titile bar
      height: 32,
    },
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setBackgroundColor("#191A19");
  win.setMenuBarVisibility(false);

  ipcMain.on("load-paragraph", (event, data) => {
    const paragraph = getParagraph();
    event.reply(data.eventName, paragraph);
  });

  //   win.loadFile("index.html");
  win.loadURL("http://localhost:3030");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
