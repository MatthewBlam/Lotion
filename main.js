const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const path = require("path");
const process = require("process");
const fs = require("fs");

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

const createWindow = () => {
  // nativeTheme.themeSource = "dark";
  app.setAppUserModelId("com.mb.lotion");

  // const { screen } = require('electron');
  // console.log(screen.getPrimaryDisplay().size);

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 850,
    minHeight: 350,
    show: false,
    // icon: __dirname + '/web/dexcom.png',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      enableBlinkFeatures: "CSSColorSchemeUARendering",
    },
    transparent: true,
    frame: false,
    hasShadow: true,
    // vibrancy: "dark", // in my case...
  });

  win.loadFile("web/index.html");

  win.once("ready-to-show", () => {
    sleep(1000);
    win.show();
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", function (e) {
  // save anything here before close
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function sendRender(message) {
  console.log("sending");
  win.webContents.send("toRender", JSON.stringify(message));
}

ipcMain.on("toMain", (event, args) => {
  var values = JSON.parse(args);
  var keys = Object.keys(values);
  var call = keys[0];

  if (call == "window_btn") {
    btn = values["window_btn"];
    if (btn == "close") {
      win.close();
    }
    if (btn == "min") {
      win.minimize();
    }
    if (btn == "max") {
      win.maximize();
    }
  }

  if (call == "platform") {
    sendRender({ "platform": process.platform });
  }

  if (call == "init_events") {
    init_events();
  }

  if (call == "register_event") {
    column = values["register_event"][0];
    title = values["register_event"][1];
    register_event(column, title);
  }

  if (call == "load_event") {
    console.log("load_event recieve");
    column = values["load_event"][0];
    title = values["load_event"][1];
    load_event(column, title);
  }
});

function init_events() {
  var rawdata = fs.readFileSync("events.json");
  var data = JSON.parse(rawdata);
  sendRender({ "display_columns_events": data[1] });
}

function register_event(column, event_title) {
  var rawdata = fs.readFileSync("events.json");
  var data = JSON.parse(rawdata);
  var columns = data[1].columns;
  if (!columns.hasOwnProperty(column)) {
    columns[column] = { events: {} };
  }
  columns[column].events[event_title] = {
    title: event_title,
    description: `${event_title} Description`,
    completed: false,
    date: {
      month: "Nul",
      day: "Nl",
    },
    time: {
      hour: "Nul",
      minute: "Nl",
      ampm: "am",
    },
    tags: [],
    starred: false,
    locked: false,
  };
  var data = JSON.stringify(data, null, 2);
  fs.writeFileSync("events.json", data);
}

function load_event(column, title) {
  console.log("load_event");
  var rawdata = fs.readFileSync("events.json");
  var data = JSON.parse(rawdata);
  console.log(title);
  var event = data[1].columns[column].events[title.trim()];
  console.log(event);
  sendRender({ "open_card": event });
}
