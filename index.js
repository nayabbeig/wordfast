const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { runServer } = require("./webpack.dev.config");
const { getParagraph } = require("./electronSrc/words");

async function createWindow() {
  await runServer();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("load-paragraph", (event, data) => {
    console.log("from ipcMain");
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
