const { app, BrowserWindow, ipcMain, nativeTheme, screen, Menu } = require("electron");
const path = require("path");
const process = require("process");
const fs = require("fs");
const os = process.platform;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

function rename_key(object, old_key, new_key) {
  var new_object = {};
  for (let key in object) {
    if (key === old_key) {
      new_object[new_key] = object[key];
    } else {
      new_object[key] = object[key];
    }
  }
  return new_object;
}

const createWindow = () => {
  if (!app.getLoginItemSettings().openAtLogin) {
    app.setLoginItemSettings({
      openAtLogin: true,
    });
  }
  app.setAppUserModelId("com.mb.lotion");
  app.commandLine.appendSwitch("disable-color-correct-rendering");
  app.commandLine.appendSwitch("force-color-profile", "srgb");

  const screen_size = screen.getPrimaryDisplay().size;

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
      devTools: false
    },
    transparent: true,
    frame: false,
    hasShadow: true,
  });

  win.setMenu(null);
  win.removeMenu();

  win.loadFile("web/index.html");
  win.webContents.openDevTools();

  win.once("ready-to-show", () => {
    sleep(1000);
    win.show();
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (os !== "darwin") {
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
  win.webContents.send("toRender", JSON.stringify(message));
}

ipcMain.on("toMain", (event, args) => {
  var values = JSON.parse(args);
  var keys = Object.keys(values);
  var call = keys[0];

  if (call == "window_btn") {
    var btn = values["window_btn"];
    if (btn == "close") {
      win.close();
    }
    if (btn == "min") {
      win.minimize();
    }
    if (btn == "max") {
      win.maximize();
    }
    if (btn == "unmax") {
      win.unmaximize();
    }
  }

  if (call == "platform") {
    sendRender({ "platform": os });
  }

  if (call == "set_theme") {
    set_theme(values["set_theme"]);
  }

  if (call == "register_column") {
    var title = values["register_column"];
    register_column(title);
  }

  if (call == "rename_column") {
    var old_title = values["rename_column"][0];
    var new_title = values["rename_column"][1];
    rename_column(old_title, new_title);
  }

  if (call == "column_filter") {
    var column = values["column_filter"][0];
    var by = values["column_filter"][1];
    column_filter(column, by);
  }

  if (call == "column_index") {
    var column = values["column_index"][0];
    var index = values["column_index"][1];
    column_index(column, index);
  }

  if (call == "delete_column") {
    var column = values["delete_column"];
    delete_column(column);
  }

  if (call == "init_columns_events") {
    init_columns_events();
  }

  if (call == "register_event") {
    var column = values["register_event"][0];
    var title = values["register_event"][1];
    register_event(column, title);
  }

  if (call == "save_event_property") {
    var column = values["save_event_property"][0];
    var event = values["save_event_property"][1];
    var render_data = values["save_event_property"][2];
    save_event_property(column, event, render_data);
  }

  if (call == "delete_event") {
    var column = values["delete_event"][0];
    var event = values["delete_event"][1];
    delete_event(column, event);
  }

  if (call == "load_event") {
    var column = values["load_event"][0];
    var title = values["load_event"][1];
    load_event(column, title);
  }

  if (call == "delete_tag") {
    var column = values["delete_tag"][0];
    var event = values["delete_tag"][1];
    var tag = values["delete_tag"][2];
    delete_tag(column, event, tag);
  }
});

function set_theme(theme) {
  nativeTheme.themeSource = theme;
}

var events_file;
if (os == "darwin") {
  events_file = path.join(process.resourcesPath, "extraResources", "events.json");
} else {
  events_file = path.join(app.getPath("appData"), "events.json");
  if (!fs.existsSync(events_file)) {
    var events_init_data = {
      "columns": {
        "Todo": {
          "index": 0,
          "filter": "Date",
          "events": {}
        }
      }
    }
    fs.writeFileSync(events_file, JSON.stringify(events_init_data));
  }
}
// const events_file = "events.json"; // For use in dev environment

function get_data() {
  var rawdata = fs.readFileSync(events_file);
  return JSON.parse(rawdata);
}

function save_data(data) {
  var data = JSON.stringify(data, null, 2);
  fs.writeFileSync(events_file, data);
}

function init_columns_events() {
  var data = get_data();
  sendRender({ "display_columns_events": data });
}

function register_column(column_title) {
  var data = get_data();
  var columns = data.columns;
  columns[column_title] = { filter: "Date", events: {} };
  save_data(data);
}

function rename_column(old_title, new_title) {
  var data = get_data();
  var columns = data.columns;
  var new_object = rename_key(columns, old_title, new_title);
  data.columns = new_object;
  save_data(data);
}

function column_filter(column, by) {
  var data = get_data();
  data.columns[column].filter = by;
  save_data(data);
}

function column_index(column, index) {
  var data = get_data();
  data.columns[column].index = index;
  save_data(data);
}

function delete_column(column) {
  var data = get_data();
  delete data.columns[column];
  save_data(data);
}

function register_event(column, event_title) {
  var data = get_data();
  var columns = data.columns;
  if (!columns.hasOwnProperty(column)) {
    columns[column] = { filter: "Date", events: {} };
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
      ampm: "AM",
    },
    tags: {},
    starred: false,
    locked: false,
  };
  save_data(data);
}

function save_event_property(column, event, render_data) {
  var local_data = get_data();
  var column = local_data.columns[column];
  var event = column.events[event];
  try {
    var old_title = event.title;
  } catch {
  } finally {
  }
  for (var key of Object.keys(render_data)) {
    if (key == "tags") {
      var tag = render_data[key];
      event[key][tag.name] = tag;
    } else {
      event[key] = render_data[key];
    }
  }
  if (old_title !== event.title) {
    var updated_column = rename_key(column.events, old_title, render_data.title);
    column.events = updated_column;
  }
  save_data(local_data);
}

function delete_event(column, event) {
  var data = get_data();
  delete data.columns[column].events[event];
  save_data(data);
}

function load_event(column, title) {
  var data = get_data();
  var event = data.columns[column].events[title];
  sendRender({ "open_card": [column, event] });
}

function delete_tag(column, event, tag) {
  var data = get_data();
  delete data.columns[column].events[event].tags[tag];
  save_data(data);
}
