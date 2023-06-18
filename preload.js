const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadParagraph: (callback = (data) => console.log(data)) => {
    const eventName = "load-paragraph";
    ipcRenderer.once(eventName, (event, data) => {
      console.log("Loading paragraph...");
      callback(data);
    });
    ipcRenderer.send(eventName, { eventName });
  },
});
