const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadParagraph: (callback = (data) => data) => {
    const eventName = "load-paragraph";
    ipcRenderer.once(eventName, (event, data) => {
      callback(data);
    });
    ipcRenderer.send(eventName, { eventName });
  },
});
