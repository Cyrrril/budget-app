import { app, BrowserWindow } from 'electron';
import path from 'path';
import * as url from 'url';

const isDev = !app.isPackaged;

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
      },
    });
  
    if (isDev) {
      // Vite dev server
      win.loadURL('http://localhost:5173');
      win.webContents.openDevTools();
    } else {
      // Load production build
      win.loadURL(
        url.format({
          pathname: path.join(__dirname, '../../renderer/dist/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      );
    }
  };
  
  app.whenReady().then(createWindow);