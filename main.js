const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

const createWindow = () => {
  app.setAppUserModelId('com.mb.lotion');

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 850,
    minHeight: 350,
    // icon: __dirname + '/web/dexcom.png',
    // frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    // transparent: true,
    // resizable: false,
    show: false,
    // hasShadow: false,
  });

  win.loadFile('web/index.html')

  win.once('ready-to-show', () => {
    sleep(1000);
    win.show();
  });

  ipcMain.on('toMain', (event, args) => {
    var values = JSON.parse(args);
    var keys = Object.keys(values);
    var call = keys[0];
    if (call == 'sM.close()') {
      win.close();
    }
    if (call == 'sM.minimize()') {
      win.minimize();
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', function (e) {
  // save anything here before close
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


function sendRender(message) {
  win.webContents.send('toRender', JSON.stringify(message));
}

ipcMain.on('toMain', (event, args) => {
  var values = JSON.parse(args);
  var keys = Object.keys(values);
  var call = keys[0];

  if (call == 'sM.test()') {
    console.log(values['sM.test()']);
  }
});
