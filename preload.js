const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('snapsum', {
  // Get desktop capture sources (screens + windows)
  getSources: () => ipcRenderer.invoke('get-sources'),

  // Show save dialog, returns file path
  saveVideo: (opts) => ipcRenderer.invoke('save-video', opts),

  // Write video buffer to disk
  writeFile: (opts) => ipcRenderer.invoke('write-file', opts),

  // Open external URL
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Show system notification
  showNotification: (opts) => ipcRenderer.invoke('show-notification', opts),

  // Get user data directory
  getAppPath: () => ipcRenderer.invoke('get-app-path'),

  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
});
