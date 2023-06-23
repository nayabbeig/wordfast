const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const result = require("dotenv").config();

const env = result.parsed;

async function createWindow() {
  if (env?.DEVELOPMENT) {
    const { runServer } = require("./webpack.dev.config");
    await runServer();
  }
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
      preload: "preload.js",
      devTools: env?.DEVELOPMENT ? true : false,
    },
    icon: "icon.ico",
  });

  win.setBackgroundColor("#191A19");
  win.setMenuBarVisibility(false);

  //   win.loadFile("index.html");
  if (env?.DEVELOPMENT) {
    win.loadURL("http://localhost:3030");
  } else {
    win.loadFile("index.html");
  }
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
