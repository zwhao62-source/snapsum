const { app, BrowserWindow, desktopCapturer, ipcMain, dialog, shell, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    frame: true,
    show: false,
  });

  // Load the recording UI
  const indexPath = path.join(__dirname, 'src', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open DevTools in dev mode
  if (process.argv.includes('--enable-logging')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── Desktop Capture (getDisplayMedia equivalent) ─────────────────────────────
ipcMain.handle('get-sources', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['window', 'screen'],
      thumbnailSize: { width: 320, height: 180 },
      fetchWindowIcons: true,
    });

    return sources.map(s => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail.toDataURL(),
      appIcon: s.appIcon ? s.appIcon.toDataURL() : null,
      display_id: s.display_id,
    }));
  } catch (err) {
    console.error('[Main] getSources error:', err);
    return [];
  }
});

// ─── Show Save Dialog ──────────────────────────────────────────────────────────
ipcMain.handle('save-video', async (event, { defaultName }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName || 'snapsum-recording.webm',
    filters: [{ name: 'WebM Video', extensions: ['webm'] }],
  });
  return filePath;
});

// ─── Save File ─────────────────────────────────────────────────────────────────
ipcMain.handle('write-file', async (event, { filePath, buffer }) => {
  try {
    const buf = Buffer.from(buffer);
    fs.writeFileSync(filePath, buf);
    return { success: true, size: buf.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ─── Open External ─────────────────────────────────────────────────────────────
ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

// ─── Notification ──────────────────────────────────────────────────────────────
ipcMain.handle('show-notification', async (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

// ─── Get App Path ─────────────────────────────────────────────────────────────
ipcMain.handle('get-app-path', async () => {
  return app.getPath('userData');
});

// ─── Window Controls ──────────────────────────────────────────────────────────
ipcMain.handle('window-minimize', () => mainWindow?.minimize());
ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle('window-close', () => mainWindow?.close());

// ─── App Lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

console.log('[SnapSum] Electron main process started');
