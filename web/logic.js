// TODO: revamp event time and date system, with the positioning and everything

// GLOBAL VARIABLES

var platform;
var months_abr = {
  "Jan": 1,
  "Feb": 2,
  "Mar": 3,
  "Apr": 4,
  "May": 5,
  "Jun": 6,
  "Jul": 7,
  "Aug": 8,
  "Sep": 9,
  "Oct": 10,
  "Nov": 11,
  "Dec": 12,
};
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursdsay", "Friday", "Saturday"];

// GLOBAL VARIABLES

// Sleep function for pauses
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

// Accurate round function
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

// Send message to node script
function sendMain(message) {
  window.api.send("toMain", JSON.stringify(message));
}

// Receive message from node script
window.api.receive("toRender", (data) => {
  var values = JSON.parse(data);
  var keys = Object.keys(values);
  var call = keys[0];

  if (call == "platform") {
    platform = values["platform"];
    set_os_titlebar(platform);
  }

  if (call == "resize") {
    fullscreen = values["resize"];
    mac_resize_handler(fullscreen);
  }

  if (call == "display_columns_events") {
    columns = values["display_columns_events"];
    display_columns_events(columns);
  }

  if (call == "open_card") {
    column = values["open_card"][0];
    var event_element = values["open_card"][1];
    open_card_container(column, event_element);
  }
});

// Send title button events
var mac_close = document.querySelector(".close-btn");
var mac_min = document.querySelector(".min-btn");
var mac_max = document.querySelector(".max-btn");
var t1 = document.querySelector(".t1");
var t2 = document.querySelector(".t2");
var mac_btns = document.querySelectorAll(".btn");

var win_close = document.querySelector(".win-close-btn");
var win_min = document.querySelector(".win-min-btn");
var win_toggle = document.querySelector(".win-toggle");
var win_grow = document.querySelector(".win-grow-icon");
var win_shrink = document.querySelector(".win-shrink-icon");
var win_btns = document.querySelectorAll(".win-btn");

function set_window_btns() {
  mac_btns.forEach(function (btn) {
    btn.addEventListener("click", mac_btn_handler);
  });
  win_btns.forEach(function (btn) {
    btn.addEventListener("click", win_btn_handler);
  });
}

function mac_btn_handler(e) {
  var btn = e.target;
  if (btn == mac_close) {
    sendMain({ "window_btn": "close" });
  }
  if (btn == mac_min) {
    sendMain({ "window_btn": "min" });
  }
  if (btn == mac_max) {
    if (mac_max.getAttribute("data-fullscreen") == "false") {
      sendMain({ "window_btn": "max" });
      t1.style.top = "calc(50% + 2.25px)";
      t1.style.left = "calc(50% - 2.25px)";
      t2.style.top = "calc(50% - 2.25px)";
      t2.style.left = "calc(50% + 2.25px)";
      mac_max.setAttribute("data-fullscreen", "true");
    } else {
      sendMain({ "window_btn": "unmax" });
      t1.style.top = "calc(50% - 0.65px)";
      t1.style.left = "calc(50% + 0.65px)";
      t2.style.top = "calc(50% + 0.65px)";
      t2.style.left = "calc(50% - 0.65px)";
      mac_max.setAttribute("data-fullscreen", "false");
    }
  }
}

function mac_resize_handler(fullscreen) {
  if (fullscreen) {
    t1.style.top = "calc(50% + 2.25px)";
    t1.style.left = "calc(50% - 2.25px)";
    t2.style.top = "calc(50% - 2.25px)";
    t2.style.left = "calc(50% + 2.25px)";
    mac_max.setAttribute("data-fullscreen", "true");
    return;
  } else if (!fullscreen) {
    t1.style.top = "calc(50% - 0.65px)";
    t1.style.left = "calc(50% + 0.65px)";
    t2.style.top = "calc(50% + 0.65px)";
    t2.style.left = "calc(50% - 0.65px)";
    mac_max.setAttribute("data-fullscreen", "false");
  }
}

function win_btn_handler(e) {
  var btn = e.target;
  if (btn == win_close) {
    sendMain({ "window_btn": "close" });
  }
  if (btn == win_min) {
    sendMain({ "window_btn": "min" });
  }
  if (btn == win_toggle) {
    if (win_toggle.getAttribute("data-fullscreen") == "false") {
      sendMain({ "window_btn": "max" });
      win_grow.style.opacity = "0";
      win_shrink.style.opacity = "1";
      win_toggle.setAttribute("data-fullscreen", "true");
    } else {
      sendMain({ "window_btn": "unmax" });
      win_shrink.style.opacity = "0";
      win_grow.style.opacity = "1";
      win_toggle.setAttribute("data-fullscreen", "false");
    }
  }
}

var mac_title_bar = document.querySelector(".mac_title_bar");
var win_title_bar = document.querySelector(".windows_title_bar");
var theme_container = document.querySelector(".theme_toggle_container");
function set_os_titlebar(platform) {
  if (platform == "darwin") {
    mac_title_bar.style.display = "block";
    theme_container.style.right = "9px";
    return;
  }
  win_title_bar.style.display = "block";
  theme_container.style.left = "9px";
}

// Startup tasks
document.addEventListener("DOMContentLoaded", init);
function init() {
  sendMain({ "platform": null });
  init_columns_events();
}
function long_ass_init() {
  set_theme();
  set_card_size();
  disable_spellcheck();
  set_todays_date();
  set_searchbar();
  set_window_btns();
  set_events();
  set_tag_circles();
  init_checkboxes();
  set_checkboxes();
  set_sort_menu();
  set_counts();
  set_cdm_dropdowns();
  set_ctm_dropdowns();
  set_column_add_btns();
  set_column_option_btns();
  set_column_option_menus();
}
//

// START PAGE LOGIC HERE

// Theme

var theme_toggle_btn = document.querySelector(".theme_toggle_btn");
var moon = document.querySelector(".moon_icon");
var sun = document.querySelector(".sun_icon");
theme_toggle_btn.addEventListener("click", toggle_theme);
var hide_tt;
function show_theme_toggle() {
  clearTimeout(hide_tt);
  theme_toggle_btn.style.opacity = "1";
}

function hide_theme_toggle() {
  hide_tt = setTimeout(function () {
    theme_toggle_btn.style.opacity = "0";
  }, 3000);
}

function freeze_elements() {
  document.body.querySelectorAll("*").forEach(function (element) {
    element.classList.add("notransition");
  });
}

function unfreeze_elements() {
  document.body.querySelectorAll("*").forEach(function (element) {
    element.offsetHeight;
    element.classList.remove("notransition");
  });
}

var root = document.querySelector(":root");
function set_theme() {
  if (!localStorage.theme) {
    localStorage.setItem("theme", "light");
  }
  var theme = localStorage.getItem("theme");
  sendMain({ "set_theme": theme });
  if (theme == "dark") {
    sun.style.opacity = "1";
    moon.style.opacity = "0";
    root.classList.remove("light");
    root.classList.add("dark");
    return;
  }
  moon.style.opacity = "1";
  sun.style.opacity = "0";
  root.classList.add("light");
}

function toggle_theme(e) {
  var theme = "light";
  freeze_elements();
  if (root.classList.contains("light")) {
    theme = "dark";
    root.classList.remove("light");
    root.classList.add("dark");
    sun.style.opacity = "1";
    moon.style.opacity = "0";
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    moon.style.opacity = "1";
    sun.style.opacity = "0";
  }
  unfreeze_elements();
  sendMain({ "set_theme": theme });
  localStorage.setItem("theme", theme);
}

// Date

var todays_date_txt = document.querySelector(".date_today");
function set_todays_date() {
  var today = new Date();
  var day = String(today.getDate());
  var month = months[today.getMonth()];
  var weekday = weekdays[today.getDay()];
  today = `${weekday}, ${month} ${day}`;
  todays_date_txt.textContent = today;

  setTimeout(set_todays_date, 60000);
}

// Create new element from string
function create_element(html_string) {
  var div = document.createElement("div");
  div.innerHTML = html_string.trim();
  return div.firstChild;
}

// Disable spell check
function disable_spellcheck() {
  var elements = Array.from(document.querySelectorAll("input"));
  elements.push(card_title, card_description);
  elements.forEach(function (element) {
    element.setAttribute("spellcheck", "false");
  });
}

// Universal page click handler
var in_title = false;
document.addEventListener("click", doc_handler);
document.addEventListener("keydown", doc_handler);
document.addEventListener("keypress", doc_handler);
document.addEventListener("contextmenu", doc_handler);
document.addEventListener("mousemove", doc_handler);
document.addEventListener("mouseleave", doc_handler);
document.addEventListener("mouseenter", doc_handler);
function doc_handler(e) {
  if (e.type == "mousemove") {
    var inside_x = e.clientX <= 150;
    if (platform == "darwin") {
      inside_x = e.clientX >= window.innerWidth - 150;
    }
    if (e.clientY <= 50 && inside_x) {
      if (!in_title) {
        in_title = true;
        show_theme_toggle();
      }
    } else if (in_title) {
      in_title = false;
      hide_theme_toggle();
    }
  }
  if (e.type == "mouseenter") {
    var inside_x = e.clientX <= 150;
    if (platform == "darwin") {
      inside_x = e.clientX >= window.innerWidth - 150;
    }
    if (e.clientY <= 50 && inside_x) {
      in_title = true;
      show_theme_toggle();
    }
  }
  if (e.type == "mouseleave") {
    if (in_title) {
      in_title = false;
      hide_theme_toggle();
    }
  }
  if (e.type == "contextmenu") {
    var classes = e.target.classList;
    if (classes.contains("columns") || classes.contains("column") || classes.contains("column_event_list") || classes.contains("column_topbar")) {
      var left = e.clientX;
      var top = e.clientY;
      if (window.innerWidth - left < 100) {
        left = left - 100;
      }
      add_column_btn.style.top = `${top + 12}px`;
      add_column_btn.style.left = `${left + 12}px`;
      add_column_btn.style.pointerEvents = "auto";
      add_column_btn.style.opacity = "1";
      add_column_btn.setAttribute("data-open", "true");
    } else {
      add_column_btn.style.pointerEvents = "none";
      add_column_btn.style.opacity = "0";
      add_column_btn.setAttribute("data-open", "false");
    }
  }
  if (e.type == "keydown") {
    if (e.keyCode === 9) {
      e.preventDefault();
    }
  }
  if (e.type == "keypress") {
    if (enter_pressed(e.keyCode)) {
      if (card_date.getAttribute("data-open") == "true") {
        close_card_date();
      }
      if (card_time.getAttribute("data-open") == "true") {
        close_card_time();
      }
      if (add_tag_container.getAttribute("data-open") == "true") {
        at_create.click();
      }
      if (co_rename_input.getAttribute("data-open") == "true") {
        column_container.click();
      }
    }
  }
  if (e.type == "click") {
    var target = e.target;
    if (target !== sort_dropdown && target !== sort_menu && !target.classList.contains("sort_menu_item")) {
      sort_menu.style.opacity = "0";
      sort_menu.style.pointerEvents = "none";
      sort_caret.style.transform = "rotate(90deg)";
    }
    if (target !== card_date_menu && target !== card_date && !target.classList.contains("cdtm") && !target.classList.contains("cdm") && !target.classList.contains("s")) {
      if (card_date.getAttribute("data-open") == "true") {
        close_card_date();
      }
    }
    if (target !== card_time_menu && target !== card_time && !target.classList.contains("cttm") && !target.classList.contains("ctm") && !target.classList.contains("s")) {
      if (card_time.getAttribute("data-open") == "true") {
        close_card_time();
      }
    }
    if (target !== co_rename_input && target !== co_delete && target !== co_filter && !target.classList.contains("mi")) {
      if (target.classList.contains("column_options_btn")) {
        var exception = get_sibling(target.parentElement, "column_options_menu");
      }
      var active_menu;
      get_co_menus().forEach(function (menu) {
        if (menu !== exception) {
          if (menu.getAttribute("data-open") == "true") {
            active_menu = menu;
          }
          menu.style.opacity = "0";
          menu.style.pointerEvents = "none";
          menu.setAttribute("data-open", "false");
        }
      });
      try {
        var column = active_menu.parentElement.parentElement;
      } catch {
        if (co_rename_input.getAttribute("data-open") == "true") {
          var columns = Array.from(column_container.children);
          var column = columns[columns.length - 1];
          var column_title = column.children[0].children[0].children[0];
          column_title.textContent = co_rename_input.value;
          close_co_rename_input();
          sendMain({ "register_column": column_title.textContent.trim() });
        }
      } finally {
      }
      if (co_rename_input.getAttribute("data-open") == "true") {
        close_co_rename_input();
        var old_title = column.children[0].children[0].children[0].textContent;
        var new_title = co_rename_input.value;
        if (old_title != new_title) {
          column.children[0].children[0].children[0].textContent = co_rename_input.value;
          sendMain({ "rename_column": [old_title, new_title] });
        }
      }
      if (co_delete.getAttribute("data-open") == "true") {
        close_co_delete();
        if (target.classList.contains("mi_delete_btn")) {
          remove_column(column);
          set_sort_menu();
        }
      }
      if (co_filter.getAttribute("data-open") == "true") {
        close_co_filter();
      }
      resize_count();
      if (target.classList.contains("mif")) {
        filter_by = target.children[0].textContent.trim();
        filter_events(column, filter_by);
      }
    }
    if (add_column_btn.getAttribute("data-open") == "true") {
      add_column_btn.style.pointerEvents = "none";
      add_column_btn.style.opacity = "0";
      add_column_btn.setAttribute("data-open", "false");
    }
  }
}

function enter_pressed(keycode) {
  if (keycode == 13) {
    return true;
  }
  return false;
}

// Error message
var error_message = document.getElementById("error_message");
var em_txt = document.getElementById("em_txt");
var err_timeout;

function display_error(message) {
  clearTimeout(err_timeout);
  function go_away() {
    error_message.style.opacity = "0";
  }
  em_txt.textContent = message;
  error_message.style.opacity = "1";
  err_timeout = setTimeout(go_away, 3000);
}

// Return the sibling of a given element by class name
function get_sibling(element, class_name) {
  var siblings = element.parentElement.childNodes;
  var target;
  siblings.forEach(function (sibling) {
    try {
      if (sibling.classList.contains(class_name)) {
        target = sibling;
      }
    } catch (error) {}
  });
  return target;
}

// Return the child of a given element by class name
function get_child(element, class_name) {
  var children = element.childNodes;
  var target;
  children.forEach(function (child) {
    try {
      if (child.classList.contains(class_name)) {
        target = child;
      }
    } catch (error) {}
  });
  return target;
}

// Load columns and events
function init_columns_events() {
  sendMain({ "init_columns_events": "null" });
}

function display_columns_events(columns) {
  columns = columns.columns;
  Object.keys(columns).forEach(function (key) {
    var html_string = `
    <div class="column" data-filter="${columns[key].filter}">
      <div class="column_topbar">
        <div class="column_text ct">
          <div class="column_title">${key}</div>
          <div class="column_count"></div>
        </div>
        <div class="column_buttons ct">
          <svg class="column_options_btn cb" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path class="cbp" d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
          <svg class="column_add_btn cb" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="cbp" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.95" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </div>
        <div class="column_options_menu" data-open="false">
          <div class="mi_container" data-open="false">
            <div class="co_rename mi">
              <div class="mi_text smi">Rename</div>
              <svg class="mi_caret smi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" /></svg>
            </div>
          </div>
          <div class="mi_container" data-open="false">
            <div class="co_delete mi">
              <div class="mi_text smi">Delete</div>
              <svg class="mi_caret smi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" /></svg>
            </div>
          </div>
          <div class="mi_container">
            <div class="co_filter mi">
              <div class="mi_text smi">Filter</div>
              <svg class="mi_caret smi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" /></svg>
            </div>
          </div>
        </div>
      </div>
      <div class="column_event_list"></div>
    </div>`;
    var new_column = create_element(html_string);
    document.querySelector(".columns").append(new_column);
    var childs = Array.from(column_container.children);
    var column = childs[childs.length - 1];
    var event_list = column.children[1];
    Object.keys(columns[key].events).forEach(function (event) {
      event = columns[key].events[event];
      date_opacity = 1;
      if (event.date.day == "Nl" || event.date.month == "Date" || event.date.month == "Nul") {
        date_opacity = 0;
      }
      time_opacity = 1;
      if (event.time.minute == "Nl" || event.time.hour == "Time" || event.time.hour == "Nul") {
        time_opacity = 0;
      }
      var height = 53;
      var circles = "";
      var tags = Object.keys(event.tags);
      if (tags.length != 0) {
        tags.forEach(function (tag) {
          var color = event.tags[tag].color;
          color = `var(--${color[0]}100)`;
          circles += `<div class="tag_circle" style="background-color: ${color};" data-name="${event.tags[tag].name}"></div>`;
        });
        height = 69;
      }
      var html_string = `
        <div class="event" data-height="${height}" style="min-height: ${height}px; max-height: ${height}px;">
          <div class="event_main">
            <div class="checkbox_container">
              <div class="checkbox_indicator"></div>
              <input class="checkbox" type="checkbox" data-checked="${event.completed}" data-starred=${event.starred} data-locked=${event.locked}/>
              <svg class="checkbox_checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="event_title">
              ${event.title}
              <div class="strike"></div>
            </div>
            <div class="event_date" style="opacity: ${date_opacity};">${event.date.month} ${event.date.day}</div>
            <div class="event_time" style="opacity: ${time_opacity};">${event.time.hour}:${event.time.minute} ${event.time.ampm}</div>
          </div>
          <div class="event_description">${event.description}</div>
          <div class="tag_circles">${circles}</div>
        </div>`;
      var new_event = create_element(html_string);
      event_list.append(new_event);
      var event_newest = event_list.children[event_list.children.length - 1];
      var ev_date = event_newest.children[0].children[2];
      var ev_time = event_newest.children[0].children[3];
      if (ev_time.style.opacity != 0) {
        ev_time.style.pointerEvents = "auto";
        var date_width = 0;
        if (ev_date.style.opacity != 0) {
          date_width = ev_date.offsetWidth + 6;
          event_newest.children[0].children[1].style.maxWidth = "calc(100% - 120px)";
        } else {
          event_newest.children[0].children[1].style.maxWidth = "calc(100% - 84px)";
        }
        ev_time.style.right = `${date_width + 8}px`;
      } else {
        ev_time.style.pointerEvents = "none";
      }
      var is_description = true;
      if (event_newest.children[1].textContent == "") {
        is_description = false;
      }
      var is_tags = true;
      if (tags.length == 0) {
        is_tags = false;
      }
      set_event_size(event_newest, is_description, is_tags);
    });
    filter_events(column, columns[key].filter);
  });
  long_ass_init();
}

// Save columns and events

var card_active_title;
function save_card_property(property, value) {
  var column_title = card_active_column.children[0].children[0].children[0].textContent.trim();
  var event_title = card_title.textContent.trim();
  if (property == "title") {
    event_title = card_active_event.children[0].children[1].textContent.trim();
    sendMain({ "save_event_property": [column_title, event_title, { "title": value }] });
    card_active_event.children[0].children[1].childNodes[0].nodeValue = card_title.textContent.trim();
  }
  if (property == "description") {
    sendMain({ "save_event_property": [column_title, event_title, { "description": value }] });
    card_active_event.children[1].textContent = card_description.textContent.trim();
  }
  if (property == "completed") {
    event_title = card_active_event.children[0].children[1].textContent.trim();
    sendMain({ "save_event_property": [column_title, event_title, { "completed": value }] });
  }
  if (property == "date") {
    sendMain({ "save_event_property": [column_title, event_title, { "date": value }] });
  }
  if (property == "time") {
    sendMain({ "save_event_property": [column_title, event_title, { "time": value }] });
  }
  if (property == "favorite") {
    sendMain({ "save_event_property": [column_title, event_title, { "starred": value }] });
  }
  if (property == "favorite") {
    sendMain({ "save_event_property": [column_title, event_title, { "starred": value }] });
  }
  if (property == "lock") {
    sendMain({ "save_event_property": [column_title, event_title, { "locked": value }] });
  }
  if (property == "tags") {
    sendMain({ "save_event_property": [column_title, event_title, { "tags": value }] });
  }
}

// Searchbar logic
var searchbar = document.querySelector(".searchbar");
var searchbar_x = document.querySelector(".searchbar_x");
function set_searchbar() {
  searchbar.addEventListener("keyup", searchbar_handler);
  searchbar.addEventListener("blur", searchbar_handler);
  searchbar.addEventListener("mouseover", searchbar_handler);
  searchbar.addEventListener("mouseout", searchbar_handler);
  searchbar_x.addEventListener("click", reset_searchbar);
}

function reset_searchbar(e) {
  searchbar.value = "";
  reset_events_after_search();
}

function searchbar_handler(e) {
  if (e.type == "mouseover") {
    if (searchbar.value != "") {
      searchbar_x.style.opacity = "1";
      searchbar_x.style.pointerEvents = "auto";
    } else {
      searchbar_x.style.opacity = "0";
      searchbar_x.style.pointerEvents = "none";
    }
  }
  if (e.type == "mouseout") {
    if (searchbar.value == "") {
      searchbar_x.style.opacity = "0";
      searchbar_x.style.pointerEvents = "none";
    }
  }
  if (e.type == "keyup") {
    sort_events_by_search();
  }
  if (e.type == "blur") {
    reset_events_after_search();
  }
}

function sort_events_by_search() {
  var search = searchbar.value.trim().toLowerCase();
  if (search == "") {
    reset_events_after_search();
    searchbar_x.style.opacity = "0";
    searchbar_x.style.pointerEvents = "none";
    return;
  }
  searchbar_x.style.opacity = "1";
  searchbar_x.style.pointerEvents = "auto";
  var events = Array.from(document.querySelectorAll(".event"));
  events.forEach(function (event) {
    var title = event.children[0].children[1].textContent.trim().toLowerCase();
    var description = event.children[1].textContent.toLowerCase();
    if (title.includes(search) || description.includes(search)) {
      event.style.display = "block";
    } else {
      event.style.display = "none";
    }
  });
}

function reset_events_after_search() {
  if (searchbar.value != "") {
    return;
  }
  var events = Array.from(document.querySelectorAll(".event"));
  events.forEach(function (event) {
    event.style.display = "block";
  });
}

// Sort logic
var sort_dropdown = document.querySelector(".sort_container");
var sort_menu = document.querySelector(".sort_menu");
var sort_caret = document.querySelector(".sort_caret");
sort_dropdown.addEventListener("click", open_sort_menu);

function open_sort_menu(e) {
  sort_menu.style.opacity = "1";
  sort_menu.style.pointerEvents = "auto";
  sort_caret.style.transform = "rotate(270deg)";
}

function set_sort_menu() {
  sort_menu.innerHTML = "";
  var column_titles = Array.from(document.querySelectorAll(".column_title"));
  column_titles.forEach(function (title) {
    var html_string = `
      <div class="sort_menu_item">
        <svg class="eye_open_icon ei" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00187 5.25201C5.59002 5.25201 5.25304 5.59039 5.25304 6.00396C5.25304 6.41753 5.59002 6.7559 6.00187 6.7559C6.41373 6.7559 6.7507 6.41753 6.7507 6.00396C6.7507 5.59039 6.41373 5.25201 6.00187 5.25201ZM11.9925 5.9814C11.9925 5.97388 11.9925 5.97388 11.9925 5.96636V5.95884C11.9925 5.95132 11.9925 5.95132 11.9925 5.9438C11.9925 5.93628 11.9925 5.93628 11.9925 5.92876V5.92876C11.9775 5.82349 11.9326 5.73326 11.8652 5.65806C11.4833 5.15426 11.0265 4.71061 10.5622 4.30456C9.5663 3.42478 8.42808 2.68787 7.17005 2.39461C6.43619 2.21415 5.70983 2.20663 4.97598 2.3495C4.30952 2.48485 3.67301 2.75555 3.06646 3.09392C2.13042 3.62781 1.26927 4.35719 0.520437 5.17682C0.385647 5.33472 0.250858 5.48511 0.123557 5.65054C-0.0411856 5.86861 -0.0411856 6.13179 0.123557 6.34985C0.50546 6.85366 0.962247 7.2973 1.42652 7.70336C2.42246 8.58313 3.56069 9.32004 4.81872 9.6133C5.54509 9.78625 6.27894 9.79377 7.01279 9.64338C7.67925 9.50803 8.31576 9.23733 8.92231 8.89895C9.85835 8.36507 10.7195 7.63568 11.4683 6.81606C11.6031 6.66567 11.7454 6.50776 11.8727 6.34233C11.9401 6.26714 11.985 6.16939 12 6.07163V6.07163C12 6.06411 12 6.06411 12 6.05659C12 6.04907 12 6.04907 12 6.04155V6.03404C12 6.02652 12 6.02652 12 6.019C12 6.01148 12 6.00396 12 5.99644C12 5.98892 11.9925 5.98892 11.9925 5.9814ZM6.00187 8.2598C4.75881 8.2598 3.75538 7.25219 3.75538 6.00396C3.75538 4.75573 4.75881 3.74812 6.00187 3.74812C7.24493 3.74812 8.24836 4.75573 8.24836 6.00396C8.24836 7.25219 7.24493 8.2598 6.00187 8.2598Z" fill="currentColor" />
        </svg>
        <svg class="eye_closed_icon ei" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.9775C12 5.97 12 5.97 12 5.9625V5.955C12 5.9475 12 5.9475 12 5.94C12 5.9325 12 5.9325 12 5.925V5.925C11.985 5.82 11.94 5.73 11.8725 5.655C11.505 5.1825 11.07 4.755 10.635 4.365L8.265 6.06C8.235 7.2675 7.245 8.235 6.03 8.235C5.7975 8.235 5.58 8.19 5.37 8.1225L3.8175 9.225C4.1475 9.3675 4.4925 9.495 4.845 9.5775C5.5725 9.75 6.3 9.7575 7.035 9.615C7.695 9.4875 8.34 9.21 8.9325 8.88C9.87 8.355 10.725 7.6275 11.4675 6.8175C11.6025 6.6675 11.745 6.51 11.865 6.3525C11.9325 6.2775 11.9775 6.1875 11.9925 6.0825V6.0825C11.9925 6.075 11.9925 6.075 11.9925 6.0675C11.9925 6.06 11.9925 6.06 11.9925 6.0525V6.045C11.9925 6.0375 11.9925 6.0375 11.9925 6.03C11.9925 6.0225 11.9925 6.015 11.9925 6.0075C12 5.9925 12 5.985 12 5.9775ZM11.6775 2.85C11.865 2.715 12 2.505 12 2.25C12 1.8375 11.6625 1.5 11.25 1.5C11.085 1.5 10.9425 1.56 10.8225 1.65L10.815 1.6425L8.8125 3.075C8.295 2.79 7.755 2.5575 7.185 2.4225C6.465 2.25 5.73 2.2425 5.0025 2.385C4.3425 2.52 3.6975 2.79 3.105 3.1275C2.1675 3.6525 1.3125 4.38 0.57 5.19C0.435 5.34 0.2925 5.4975 0.1725 5.655C0 5.8725 0 6.1275 0.165 6.345C0.5475 6.84 0.9975 7.2825 1.4625 7.6875C1.5975 7.8075 1.7475 7.905 1.8825 8.0175L0.315 9.1425L0.3225 9.15C0.135 9.285 0 9.495 0 9.75C0 10.1625 0.3375 10.5 0.75 10.5C0.915 10.5 1.0575 10.44 1.1775 10.35L1.185 10.3575L11.685 2.8575L11.6775 2.85ZM3.87 6.6C3.8175 6.405 3.7875 6.21 3.7875 6C3.7875 4.77 4.7925 3.765 6.03 3.765C6.495 3.765 6.9225 3.9225 7.275 4.1625L3.87 6.6Z" fill="currentColor" />
        </svg>
        <div class="smi_text">${title.textContent.trim()}</div>
      </div>`;
    var item = create_element(html_string);
    sort_menu.append(item);
  });
}

// Count logic

function set_counts() {
  var counts = Array.from(document.querySelectorAll(".column_count"));
  counts.forEach(function (count) {
    var num = get_child(count.parentElement.parentElement.parentElement, "column_event_list").children.length;
    count.textContent = num;
  });
}

function is_overflowing(element) {
  if (element.scrollWidth > element.offsetWidth) {
    return true;
  }
  return false;
}

window.addEventListener("resize", resize_count);
function resize_count(e) {
  var titles = Array.from(document.querySelectorAll(".column_title"));
  titles.forEach(function (title) {
    var count = get_sibling(title, "column_count");
    if (is_overflowing(title)) {
      count.style.paddingLeft = "4px";
    } else {
      count.style.paddingLeft = "8px";
    }
  });
}

// Checkbox logic
function is_checked(checkbox) {
  if (checkbox.checked) {
    return true;
  }
  return false;
}

function set_checkboxes() {
  var events = Array.from(document.querySelectorAll(".event"));
  events.forEach(function (event) {
    event.removeEventListener("click", checkbox_handler);
    event.addEventListener("click", checkbox_handler);
  });
}

function init_checkboxes() {
  var checkboxes = Array.from(document.querySelectorAll(".checkbox"));
  checkboxes.forEach(function (checkbox) {
    {
      if (checkbox.getAttribute("data-checked") == "false") {
        if (is_checked(checkbox)) {
          checkbox.click();
        }
        checkbox_handler({ target: checkbox });
      } else {
        if (!is_checked(checkbox)) {
          checkbox.click();
        }
        checkbox_handler({ target: checkbox });
      }
    }
  });
}

function checkbox_handler(e) {
  var target = e.target;
  if (target.classList.contains("event_title")) {
    return;
  }
  if (target.classList.contains("checkbox")) {
    var event_title = get_sibling(target.parentElement, "event_title").textContent.trim();
    var column = target.parentElement.parentElement.parentElement.parentElement.parentElement;
    card_active_column = column;
    card_active_event = target.parentElement.parentElement.parentElement;
    var column_title = column.children[0].children[0].children[0].textContent.trim();
    var checkbox = get_sibling(target, "checkbox_indicator");
    var checkmark = get_sibling(target, "checkbox_checkmark");
    if (is_checked(target)) {
      checkbox.style.background = "var(--blue)";
      checkmark.style.opacity = "1";
      target.setAttribute("data-checked", "true");
      var title = get_sibling(target.parentElement, "event_title");
      var strike = title.children[0];
      setTimeout(function () {
        if (title.offsetWidth < title.scrollWidth) {
          strike.style.width = "97%";
        } else {
          strike.style.width = "200%";
        }
      }, 10);
      title.style.color = "var(--text-muted)";
      save_card_property("completed", true);
      return;
    }
    checkbox.style.background = "var(--200)";
    checkmark.style.opacity = "0";
    target.setAttribute("data-checked", "false");
    var title = get_sibling(target.parentElement, "event_title");
    var strike = get_child(title, "strike");
    setTimeout(() => {
      strike.style.width = "0";
    }, 10);
    title.style.color = "var(--text-normal)";
    save_card_property("completed", false);
  }
}

// Card logic

var screen_blur = document.querySelector(".screen_blur");
var card_container = document.querySelector(".card_container");
var card = document.querySelector(".card");
var size_toggle = document.querySelector(".cb_size_toggle");
var expand_btn = document.querySelector(".cb_expand_icon");
var contract_btn = document.querySelector(".cb_contract_icon");
var previous_btn = document.querySelector(".cb_previous_btn");
var next_btn = document.querySelector(".cb_next_btn");
var lock_btn = document.querySelector(".cb_lock_toggle");
var unlocked = document.querySelector(".cb_unlocked_icon");
var locked = document.querySelector(".cb_locked_icon");
var favorite_btn = document.querySelector(".cb_favorite_btn");
var delete_btn = document.querySelector(".cb_delete_btn");
var card_btns = Array.from(document.querySelectorAll("cbb"));
var card_tags_container = document.querySelector(".card_tags_container");
var delete_confirm = document.querySelector(".delete_card_confirm");
var dcc_cancel = document.querySelector(".dcc_cancel");
var dcc_delete = document.querySelector(".dcc_delete");
var date_time_scroll_elements = Array.from(document.querySelectorAll(".cdm")).concat(Array.from(document.querySelectorAll(".ctm")));

size_toggle.addEventListener("click", card_size_toggle);
function card_size_toggle(e) {
  if (card_container.getAttribute("data-size") == "small") {
    expand_btn.style.opacity = "0";
    contract_btn.style.opacity = "1";
    card_container.style.width = "75%";
    card_container.style.height = "75%";
    card_container.setAttribute("data-size", "large");
    localStorage.setItem("card_size", "large");
  } else if (card_container.getAttribute("data-size") == "large") {
    expand_btn.style.opacity = "1";
    contract_btn.style.opacity = "0";
    card_container.style.width = "50%";
    card_container.style.height = "50%";
    card_container.setAttribute("data-size", "small");
    localStorage.setItem("card_size", "small");
  }
}

function set_card_size() {
  var size = localStorage.getItem("card_size");
  if (size == "large") {
    card_container.style.width = "75%";
    card_container.style.height = "75%";
    card_container.setAttribute("data-size", "large");
    return;
  }
  card_container.style.width = "50%";
  card_container.style.height = "50%";
  card_container.setAttribute("data-size", "small");
}

function enable_card_edit() {
  card_title.setAttribute("contenteditable", "true");
  card_description.setAttribute("contenteditable", "true");
  card_title.style.pointerEvents = "auto";
  card_description.style.pointerEvents = "auto";
  card_date.style.pointerEvents = "auto";
  card_time.style.pointerEvents = "auto";
  add_tag_btn.style.opacity = "1";
  add_tag_btn.style.pointerEvents = "auto";
  show_tags_x();
}

function disable_card_edit() {
  card_title.setAttribute("contenteditable", "false");
  card_description.setAttribute("contenteditable", "false");
  card_date.style.pointerEvents = "none";
  card_time.style.pointerEvents = "none";
  add_tag_btn.style.opacity = "0";
  add_tag_btn.style.pointerEvents = "none";
  hide_tags_x();
}

lock_btn.addEventListener("click", lock_toggle);
function lock_toggle(e) {
  var event_element = card_active_event;
  var checkbox = event_element.children[0].children[0].children[1];
  if (lock_btn.getAttribute("data-locked") == "false") {
    locked.style.opacity = "1";
    unlocked.style.opacity = "0";
    lock_btn.setAttribute("data-locked", "true");
    save_card_property("lock", true);
    disable_card_edit();
  } else if (lock_btn.getAttribute("data-locked") == "true") {
    locked.style.opacity = "0";
    unlocked.style.opacity = "1";
    lock_btn.setAttribute("data-locked", "false");
    checkbox.setAttribute("data-locked", "false");
    save_card_property("lock", false);
    enable_card_edit();
  }
}

favorite_btn.addEventListener("click", favorite_toggle);
function favorite_toggle(e) {
  var event_element = card_active_event;
  var checkbox = event_element.children[0].children[0].children[1];
  if (favorite_btn.getAttribute("data-starred") == "false") {
    favorite_btn.style.color = "rgb(235, 203, 139)";
    favorite_btn.setAttribute("fill", "rgb(235, 203, 139)");
    favorite_btn.setAttribute("data-starred", "true");
    checkbox.setAttribute("data-starred", "true");
    save_card_property("favorite", true);
  } else if (favorite_btn.getAttribute("data-starred") == "true") {
    favorite_btn.style.color = "var(--icon-muted)";
    favorite_btn.setAttribute("fill", "none");
    favorite_btn.setAttribute("data-starred", "false");
    checkbox.setAttribute("data-starred", "false");
    save_card_property("favorite", false);
  }
}

function get_previous_element(event) {
  var previous_element;
  var cael_length = card_active_event_list.length;
  if (cael_length == 1) {
    return false;
  }
  for (var i = 0; i < cael_length; i++) {
    if (card_active_event_list[i] == event) {
      if (i == 0) {
        previous_element = card_active_event_list[cael_length - 1];
      } else {
        previous_element = card_active_event_list[i - 1];
      }
    }
  }
  return previous_element;
}

function get_next_element(event) {
  var next_element;
  var cael_length = card_active_event_list.length;
  if (cael_length == 1) {
    return false;
  }
  for (var i = 0; i < cael_length; i++) {
    if (card_active_event_list[i] == event) {
      if (i == cael_length - 1) {
        next_element = card_active_event_list[0];
      } else {
        next_element = card_active_event_list[i + 1];
      }
    }
  }
  return next_element;
}

previous_btn.addEventListener("click", previous_element);
function previous_element(e) {
  var event = get_previous_element(card_active_event);
  if (!event) {
    return;
  }
  var event_title = event.children[0].children[1];
  close_card_container("dont_dissolve");
  event_title.click();
}

next_btn.addEventListener("click", next_element);
function next_element(e) {
  var event = get_next_element(card_active_event);
  if (!event) {
    return;
  }
  var event_title = event.children[0].children[1];
  close_card_container("dont_dissolve");
  event_title.click();
}

function get_column_by_title(column_title) {
  var columns = Array.from(column_container.children);
  var target_column = null;
  columns.forEach(function (column) {
    var title = column.children[0].children[0].children[0].textContent.trim();
    if (title == column_title) {
      target_column = column;
    }
  });
  return target_column;
}

function get_event_by_title(column, event_title) {
  var events = Array.from(get_child(column, "column_event_list").children);
  var target_event = null;
  events.forEach(function (event) {
    var title = event.children[0].children[1].textContent.trim();
    if (title == event_title) {
      target_event = event;
    }
  });
  return target_event;
}

delete_btn.addEventListener("click", open_delete_confirm);
function open_delete_confirm(e) {
  delete_confirm.style.opacity = "1";
  delete_confirm.style.pointerEvents = "auto";
}

dcc_cancel.addEventListener("click", close_delete_confirm);
dcc_delete.addEventListener("click", close_delete_confirm);
function close_delete_confirm(e) {
  delete_confirm.style.opacity = "0";
  delete_confirm.style.pointerEvents = "none";
  if (e.target == dcc_delete) {
    var column_title = card_active_column.children[0].children[0].children[0].textContent.trim();
    var event_title = card_title.textContent.trim();
    sendMain({ "delete_event": [column_title, event_title] });
    close_card_container();
    var column = get_column_by_title(column_title);
    var event_element = get_event_by_title(column, event_title);
    event_element.remove();
    set_counts();
  }
}

screen_blur.addEventListener("click", close_card_container);
var card_active_column;
var card_active_event;
var card_active_event_list;
function open_card_container(column, event) {
  card_active_column = get_column_by_title(column);
  card_active_event = get_event_by_title(card_active_column, event.title);
  if (card_container.getAttribute("data-open") == "false") {
    card_active_event_list = card_active_column.children[1].children;
  }
  var title = event.title;
  var description = event.description;
  var date = event.date;
  var time = event.time;
  var tags = event.tags;
  var starred = event.starred;
  var locked = event.locked;
  card_title.textContent = title;
  card_description.textContent = description;
  month_date_input = [date.month, date.day];
  hour_minute_input = [time.hour, time.minute];
  ampm_input = time.ampm;
  Object.keys(tags).forEach(function (key) {
    var tag = tags[key];
    add_tag_input.value = tag.name;
    update_tag_color({ target: document.querySelector(`.${tag.color}`) });
    create_tag();
  });
  var should_be_starred = favorite_btn.getAttribute("data-starred");
  if ((starred == true && should_be_starred == "false") || (starred == false && should_be_starred == "true")) {
    favorite_toggle(null);
  }
  var should_be_locked = lock_btn.getAttribute("data-locked");
  if ((locked && should_be_locked == "false") || (!locked && should_be_locked == "true")) {
    lock_toggle(null);
  }
  if (!locked) {
    enable_card_edit();
  } else {
    disable_card_edit();
  }
  close_card_date(true);
  close_card_time(true);
  reset_add_tag_btn();
  card_container.style.opacity = "1";
  card_container.style.pointerEvents = "auto";
  card_container.setAttribute("data-open", "true");
  card_btns.forEach(function (btn) {
    btn.style.pointerEvents = "auto";
  });
  screen_blur.style.opacity = "1";
  screen_blur.style.pointerEvents = "auto";
}

function set_event_size(event, description, tags) {
  if (description && tags) {
    event.setAttribute("data-height", "69");
    event.style.maxHeight = "69px";
    event.style.minHeight = "69px";
  }
  if (description && !tags) {
    event.setAttribute("data-height", "53");
    event.style.maxHeight = "53px";
    event.style.minHeight = "53px";
  }
  if (!description && tags) {
    event.setAttribute("data-height", "47");
    event.style.maxHeight = "50.5px";
    event.style.minHeight = "50.5px";
    event.children[2].style.marginTop = "-2px";
  } else {
    event.children[2].style.marginTop = "0px";
  }
  if (!description && !tags) {
    event.setAttribute("data-height", "34");
    event.style.maxHeight = "32.25px";
    event.style.minHeight = "32.25px";
  }
  if (!description) {
    event.children[1].style.marginTop = "0px";
  } else {
    event.children[1].style.marginTop = "5px";
  }
}

function close_card_container(dont_dissolve) {
  dcc_cancel.click();
  card_container.click();
  cancel_add_tag();
  var event_element = card_active_event;
  var date = card_date.childNodes[0].textContent.trim();
  var event_date = event_element.children[0].children[2];
  if (date == "Date") {
    event_date.style.display = "none";
    event_date.style.opacity = "0";
    event_date.style.pointerEvents = "none";
  } else {
    event_date.style.display = "block";
    event_date.style.opacity = "1";
    event_date.style.pointerEvents = "auto";
    event_date.textContent = date;
  }
  var time = card_time.childNodes[0].textContent.trim();
  var event_time = event_element.children[0].children[3];
  if (time == "Time") {
    event_time.style.display = "none";
    event_time.style.opacity = "0";
    event_time.style.pointerEvents = "none";
  } else {
    event_time.style.display = "block";
    event_time.style.opacity = "1";
    event_time.style.pointerEvents = "auto";
    event_time.textContent = time;
  }
  if (dont_dissolve != "dont_dissolve") {
    card_container.style.opacity = "0";
    card_container.style.pointerEvents = "none";
    card_container.setAttribute("data-open", "false");
  }
  if (event_time.style.opacity != 0) {
    event_time.style.pointerEvents = "auto";
    var date_width = 0;
    if (event_date.style.opacity != 0) {
      date_width = event_date.offsetWidth + 6;
      event_element.children[0].children[1].style.maxWidth = "calc(100% - 120px)";
    } else {
      event_element.children[0].children[1].style.maxWidth = "calc(100% - 84px)";
    }
    event_time.style.right = `${date_width + 8}px`;
  }
  card_btns.forEach(function (btn) {
    btn.style.pointerEvents = "none";
  });
  var tags = Array.from(document.querySelectorAll(".tag"));
  var tags_info = [];
  tags.forEach(function (tag) {
    var name = tag.children[0].textContent.trim();
    var color = tag.getAttribute("data-color");
    tags_info.push({ "name": name, "color": color });
    tag.remove();
  });
  add_tag_circles(card_active_event, tags_info);
  card_title.style.pointerEvents = "none";
  card_description.style.pointerEvents = "none";
  card_date.style.pointerEvents = "none";
  card_time.style.pointerEvents = "none";
  add_tag_btn.style.pointerEvents = "none";
  reset_add_tag_btn();
  if (dont_dissolve != "dont_dissolve") {
    screen_blur.style.opacity = "0";
    screen_blur.style.pointerEvents = "none";
  }
  date_time_scroll_elements.forEach(function (item) {
    item.scrollTop = 0;
  });
  var is_description = true;
  if (event_element.children[1].textContent == "") {
    is_description = false;
  }
  var is_tags = true;
  if (tags.length == 0) {
    is_tags = false;
  }
  set_event_size(event_element, is_description, is_tags);
}

// JSON MANAGMENT

function set_events() {
  var titles = document.querySelectorAll(".event_title");
  titles.forEach(function (title) {
    title.addEventListener("click", open_card_container_preamble);
  });
}

function open_card_container_preamble(e) {
  var target = e.target;
  var column = target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].textContent.trim();
  var title = target.textContent.trim();
  get_event(column, title);
}

function get_event(column, title) {
  sendMain({ "load_event": [column, title.trim()] });
}

// Column logic

var column_container = document.querySelector(".columns");

var add_column_btn = document.querySelector(".add_column");
add_column_btn.addEventListener("click", create_column);
function create_column(e) {
  var html_string = `
    <div class="column" style="flex: 0 0 0; padding: 0px;">
      <div class="column_topbar">
        <div class="column_text ct">
          <div class="column_title">New Column</div>
          <div class="column_count">0</div>
        </div>
        <div class="column_buttons ct">
          <svg class="column_options_btn cb" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path class="cbp" d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
          <svg class="column_add_btn cb" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="cbp" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.95" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </div>
        <div class="column_options_menu" data-open="false">
          <div class="mi_container" data-open="false">
            <div class="co_rename mi">
              <div class="mi_text smi">Rename</div>
              <svg class="mi_caret smi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" /></svg>
            </div>
          </div>
          <div class="mi_container" data-open="false">
            <div class="co_delete mi">
              <div class="mi_text smi">Delete</div>
              <svg class="mi_caret smi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" /></svg>
            </div>
          </div>
          <div class="mi_container">
            <div class="co_filter mi">
              <div class="mi_text smi">Filter</div>
              <svg class="mi_caret smi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" /></svg>
            </div>
          </div>
        </div>
      </div>
      <div class="column_event_list"></div>
    </div>`;
  var ct_count = 1;
  Array.from(document.querySelectorAll(".column_title")).forEach(function (title) {
    if (title.textContent.trim().includes("New Column")) {
      ct_count += 1;
    }
  });
  var title = "New Column";
  if (ct_count > 1) {
    title = `${title} ${ct_count.toString()}`;
  }
  var column = create_element(html_string);
  column_container.append(column);
  var columns = Array.from(column_container.children);
  columns[columns.length - 2].style.marginRight = "0px";
  var new_column = columns[columns.length - 1];
  co_rename_input.value = title;
  setTimeout(function () {
    new_column.style.padding = "10px";
    new_column.style.flex = "1 1 20%";
    columns[columns.length - 2].style.marginRight = "20px";
    open_co_rename_input({ left: e.clientX - 116, top: e.clientY });
  }, 100);
  set_column_add_btns();
  set_column_option_btns();
  set_column_option_menus();
}

function remove_column(column) {
  var children = Array.from(column.children);
  children.forEach(function (child) {
    child.style.opacity = "0";
  });
  var column_title = column.children[0].children[0].children[0].textContent.trim();
  sendMain({ "delete_column": column_title });
  setTimeout(function () {
    column.style.flex = "0 0 0";
    column.style.padding = "0px";
    column.style.marginRight = "0px";
    column.style.opacity = "0";
    var columns = column_container.children;
    if (column == columns[columns.length - 1]) {
      columns[columns.length - 2].style.marginRight = "0px";
    }
    setTimeout(function () {
      column.remove();
    }, 305);
  }, 350);
}

function set_column_option_btns() {
  var column_options_btns = Array.from(document.querySelectorAll(".column_options_btn"));
  column_options_btns.forEach(function (btn) {
    btn.removeEventListener("click", co_btn_handler);
    btn.addEventListener("click", co_btn_handler);
  });
}

function co_btn_handler(e) {
  var menu = get_sibling(e.target.parentElement, "column_options_menu");
  if (menu.getAttribute("data-open") == "false") {
    menu.style.opacity = "1";
    menu.style.pointerEvents = "auto";
    menu.setAttribute("data-open", "true");
  }
}

function get_co_menus() {
  return Array.from(document.querySelectorAll(".column_options_menu"));
}

function set_column_option_menus() {
  var menus = Array.from(document.querySelectorAll(".mi"));
  menus.forEach(function (menu) {
    menu.removeEventListener("mouseover", col_opt_handler);
    menu.removeEventListener("mouseout", col_opt_handler);
    menu.addEventListener("mouseover", col_opt_handler);
    menu.addEventListener("mouseout", col_opt_handler);
  });
}

var co_rename_input = document.querySelector(".mi_input");
function open_co_rename_input(loc) {
  if (co_rename_input.getAttribute("data-open") == "false") {
    if (window.innerWidth - loc.left < 250) {
      loc.left = loc.left - 120;
    }
    co_rename_input.style.top = `${loc.top}px`;
    co_rename_input.style.left = `${loc.left + 116}px`;
    co_rename_input.style.opacity = "1";
    co_rename_input.style.pointerEvents = "auto";
    co_rename_input.focus();
    co_rename_input.setAttribute("data-open", "true");
  }
}
function close_co_rename_input() {
  if (co_rename_input.getAttribute("data-open") == "true") {
    co_rename_input.style.opacity = "0";
    co_rename_input.style.pointerEvents = "none";
    co_rename_input.setAttribute("data-open", "false");
  }
}

var co_delete = document.querySelector(".mi_delete");
function open_co_delete(loc) {
  if (co_delete.getAttribute("data-open") == "false") {
    co_delete.style.top = `${loc.top}px`;
    co_delete.style.left = `${loc.left + 116}px`;
    co_delete.style.opacity = "1";
    co_delete.style.pointerEvents = "auto";
    get_child(co_delete, "mi_text").style.pointerEvents = "none";
  }
}
function close_co_delete() {
  if (co_delete.getAttribute("data-open") == "true") {
    co_delete.style.opacity = "0";
    co_delete.style.pointerEvents = "none";
    co_delete.setAttribute("data-open", "false");
  }
}

var co_filter = document.querySelector(".mi_filter");
function open_co_filter(loc) {
  if (co_filter.getAttribute("data-open") == "false") {
    co_filter.style.top = `${loc.top}px`;
    co_filter.style.left = `${loc.left + 116}px`;
    co_filter.style.opacity = "1";
    co_filter.style.pointerEvents = "auto";
    co_rename_input.setAttribute("data-open", "true");
  }
}
function close_co_filter() {
  if (co_filter.getAttribute("data-open") == "true") {
    co_filter.style.opacity = "0";
    co_filter.style.pointerEvents = "none";
    co_filter.setAttribute("data-open", "false");
  }
}

function filter_events(column, by) {
  sendMain({ "column_filter": [column.children[0].children[0].children[0].textContent.trim(), by] });
  event_list = column.children[1];
  events = Array.from(event_list.children);
  if (by == "Date") {
    events.sort(function (a, b) {
      a = a.children[0].children[2].textContent.trim().split(" ");
      b = b.children[0].children[2].textContent.trim().split(" ");
      if (b[0] == "Nul") {
        return -1;
      }
      a = { month: months_abr[a[0]], day: parseInt(a[1]) };
      b = { month: months_abr[b[0]], day: parseInt(b[1]) };
      if (a.month < b.month) {
        return -1;
      }
      if (a.month > b.month) {
        return 1;
      }
      if (a.month == b.month) {
        if (a.day < b.day) {
          return -1;
        }
        if (a.day > b.day) {
          return 1;
        }
      }
      return 0;
    });
  }
  if (by == "Name") {
    events.sort(function (a, b) {
      a = a.children[0].children[1].textContent.trim()[0];
      b = b.children[0].children[1].textContent.trim()[0];
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }
  if (by == "Favorite") {
    events.sort(function (a, b) {
      a = a.children[0].children[0].children[1].getAttribute("data-starred");
      b = b.children[0].children[0].children[1].getAttribute("data-starred");
      if (a == "true") {
        a = 1;
      } else {
        a = 2;
      }
      if (b == "true") {
        b = 1;
      } else {
        b = 2;
      }
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }
  if (by == "Complete") {
    events.sort(function (a, b) {
      a = a.children[0].children[0].children[1].getAttribute("data-checked");
      b = b.children[0].children[0].children[1].getAttribute("data-checked");
      if (a == "true") {
        a = 1;
      } else {
        a = 2;
      }
      if (b == "true") {
        b = 1;
      } else {
        b = 2;
      }
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }
  if (by == "Incomplete") {
    events.sort(function (a, b) {
      a = a.children[0].children[0].children[1].getAttribute("data-checked");
      b = b.children[0].children[0].children[1].getAttribute("data-checked");
      if (a == "false") {
        a = 1;
      } else {
        a = 2;
      }
      if (b == "false") {
        b = 1;
      } else {
        b = 2;
      }
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }
  event_list.innerHTML = "";
  events.forEach(function (event) {
    event_list.append(event);
  });
  set_events();
  set_checkboxes();
}

function col_opt_handler(e) {
  var target = e.target;
  if (target.classList.contains("mif")) {
    return;
  }
  var loc = target.getBoundingClientRect();
  var menu = target.parentElement.parentElement;
  var column_name = get_child(get_sibling(menu, "column_text"), "column_title").textContent.trim();
  var menu_loc = menu.getBoundingClientRect();
  var overflow = window.innerWidth - menu_loc.right < 110;
  if (overflow) {
    loc = { left: loc.left - 116, top: menu_loc.top + 92 };
  }
  if (e.type == "mouseover") {
    if (target.classList.contains("co_rename") && co_rename_input.getAttribute("data-open") == "false") {
      open_co_rename_input(loc);
      close_co_delete();
      close_co_filter();
      co_rename_input.value = column_name;
    }
    if (target.classList.contains("co_delete") && co_delete.getAttribute("data-open") == "false") {
      open_co_delete(loc);
      close_co_rename_input();
      close_co_filter();
      co_delete.setAttribute("data-open", "true");
    }
    if (target.classList.contains("co_filter") && co_filter.getAttribute("data-open") == "false") {
      open_co_filter(loc);
      close_co_rename_input();
      close_co_delete();
      co_filter.setAttribute("data-open", "true");
    }
  }
}

function set_column_add_btns() {
  var column_add_btns = Array.from(document.querySelectorAll(".column_add_btn"));
  column_add_btns.forEach(function (add) {
    add.removeEventListener("click", create_event);
    add.addEventListener("click", create_event);
  });
}

function init_events() {
  sendMain({ "init_events": "null" });
}

function create_event(e) {
  var list = get_sibling(e.target.parentElement.parentElement, "column_event_list");
  var column = get_child(get_sibling(e.target.parentElement, "column_text"), "column_title").textContent.trim();
  var event_titles = Array.from(document.querySelectorAll(".event_title"));
  var et_count = 1;
  event_titles.forEach(function (title) {
    if (title.textContent.trim().includes("New Event")) {
      et_count += 1;
    }
  });
  var title = "New Event";
  if (et_count > 1) {
    title = `${title} ${et_count.toString()}`;
  }
  var html_string = `
    <div class="event" data-height="53">
      <div class="event_main">
        <div class="checkbox_container">
          <div class="checkbox_indicator"></div>
          <input class="checkbox" type="checkbox" data-checked="false" data-starred="unstarred" data-locked="unlocked"/>
          <svg class="checkbox_checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="event_title">${title}
          <div class="strike"></div>
        </div>
        <div class="event_date" style="opacity: 0;"></div>
        <div class="event_time" style="opacity: 0;"></div>
      </div>
      <div class="event_description">${title} description</div>
      <div class="tag_circles"></div>
    </div>`;
  new_event = create_element(html_string);
  get_child(new_event.children[0], "event_title").addEventListener("click", open_card_container_preamble);
  list.append(new_event);
  set_counts();
  set_checkboxes();
  sendMain({ "register_event": [column, title] });
}

function add_tag_circles(event, tags) {
  var circles = "";
  if (tags.length > 0) {
    tags.forEach(function (tag) {
      circles += `<div class="tag_circle" style="background-color: ${tag.color};" data-name="${tag.name}"></div>`;
    });
    var description = true;
    if (event.children[1].textContent == "") {
      description = false;
    }
    event.children[2].innerHTML = circles;
    set_tag_circles();
    return;
  }
  event.children[2].innerHTML = circles;
}

function set_tag_circles() {
  tag_circles = Array.from(document.querySelectorAll(".tag_circle"));
  tag_circles.forEach(function (tag_circle) {
    tag_circle.removeEventListener("mouseover", tag_circle_handler);
    tag_circle.removeEventListener("mouseout", tag_circle_handler);
    tag_circle.addEventListener("mouseover", tag_circle_handler);
    tag_circle.addEventListener("mouseout", tag_circle_handler);
  });
}

var tcirc_ease;
var tag_circle_tooltip = document.querySelector(".tag_circle_tooltip");
function tag_circle_handler(e) {
  clearTimeout(tcirc_ease);
  target = e.target;
  if (e.type == "mouseover") {
    tag_circle_tooltip.style.transitionDelay = "var(--medium)";
    var name = target.getAttribute("data-name");
    tag_circle_tooltip.textContent = name;
    var tag_box = target.getBoundingClientRect();
    tag_circle_tooltip.style.top = `${tag_box.bottom + 12}px`;
    tag_circle_tooltip.style.left = `${tag_box.left}px`;
    tag_circle_tooltip.style.opacity = "1";
    return;
  }
  tag_circle_tooltip.style.opacity = "0";
  tcirc_ease = setTimeout(function () {
    tag_circle_tooltip.style.transitionDelay = "0s";
  }, 200);
}

// Card title and description logic
var card_title = document.querySelector(".card_title");
var card_description = document.querySelector(".card_description");
card_title.addEventListener("focus", card_text_edit_handler);
card_title.addEventListener("focusout", card_text_edit_handler);
card_title.addEventListener("keypress", card_text_edit_handler);
card_description.addEventListener("focus", card_text_edit_handler);
card_description.addEventListener("focusout", card_text_edit_handler);
card_description.addEventListener("keypress", card_text_edit_handler);

function card_text_edit_handler(e) {
  target = e.target;
  if (e.type == "keypress") {
    if (enter_pressed(e.keyCode)) {
      e.preventDefault();
      target.blur();
    }
  }
  if (e.type == "focusout") {
    target.scrollTop = "0";
    target.scrollLeft = "0";
    target.style.overflowX = "hidden";
    target.style.textOverflow = "ellipsis";
    if (target == card_title) {
      property = "title";
    } else if (target == card_description) {
      property = "description";
    }
    save_card_property(property, target.textContent.trim());
  }
  if (e.type == "focus") {
    target.scrollTop = "0";
    target.scrollLeft = "0";
    target.style.overflowX = "scroll";
    target.style.textOverflow = "inherit";
  }
}

// Date / time menu logic

var card_date = document.querySelector(".card_date");
var card_date_menu = document.querySelector(".cdm_container");
var cd_scrollers = card_date.children[0].children[1].children;
card_date.addEventListener("click", open_card_date);

function date_menu_to_date(month, day) {
  cd_scrollers[0].scroll(0, month * 28 + 2);
  cd_scrollers[1].scroll(0, day * 28 + 2);
  cdm_set_active_color(cd_scrollers[0]);
  cdm_set_active_color(cd_scrollers[1]);
}

function open_card_date(e) {
  card_date_menu.style.opacity = "1";
  card_date_menu.style.pointerEvents = "auto";
  card_date.style.backgroundColor = "var(--200)";
  card_date.style.color = "var(--text-normal)";
  if (month_date_input[0] == "Nul" || month_date_input[0] == "Date") {
    var date = todays_date_txt.textContent.trim().split(", ")[1].split(" ");
    var month = months_abr[date[0].substring(0, 3)];
    var day = parseInt(date[1]);
    date_menu_to_date(month, day);
  } else {
    var month = months_abr[month_date_input[0]];
    var day = parseInt(month_date_input[1]);
    date_menu_to_date(month, day);
  }
  card_date.setAttribute("data-open", "true");
}
function close_card_date(dont_save = false) {
  card_date_menu.style.opacity = "0";
  card_date_menu.style.pointerEvents = "none";
  card_date.style.backgroundColor = "var(--100)";
  card_date.style.color = "var(--text-muted)";
  var month = month_date_input[0];
  var date = month_date_input[1];
  if (month == "Nul") {
    month = "Date";
  }
  if (date == "Nl" || (month == "Date" && date !== "")) {
    date = "";
    month = "Date";
  }
  card_date.childNodes[0].nodeValue = `${month} ${date}`;
  if (!dont_save) {
    save_card_property("date", { "month": month, "day": date });
  }
  card_date.setAttribute("data-open", "false");
}

var card_time = document.querySelector(".card_time");
var am_btn = document.querySelector(".am_btn");
var pm_btn = document.querySelector(".pm_btn");
var card_time_menu = document.querySelector(".ctm_container");
var hm_scrollers = card_time.children[0].children[1].children;
card_time.addEventListener("click", open_card_time);

function open_card_time(e) {
  if (e.target.classList.contains("aps")) {
    return;
  }
  var hour = 0;
  var minute = 0;
  if (hour_minute_input[0] != "Nul" || hour_minute_input[0] != "Time" || hour_minute_input[1] != "") {
    console.log(hour_minute_input);
    hour = parseInt(hour_minute_input[0]) * 28 + 2;
    minute = (parseInt(hour_minute_input[1]) / 5 + 1) * 28 + 2;
  }
  console.log(hour, minute);
  hm_scrollers[0].scroll(0, hour);
  hm_scrollers[2].scroll(0, minute);
  ctm_set_active_color(hm_scrollers[0]);
  ctm_set_active_color(hm_scrollers[1]);
  var ampm = card_time.textContent.trim().split(" ")[1].trim();
  am_btn.click();
  if (ampm == "PM") {
    pm_btn.click();
  }
  card_time_menu.style.opacity = "1";
  card_time_menu.style.pointerEvents = "auto";
  card_time.style.backgroundColor = "var(--200)";
  card_time.style.color = "var(--text-normal)";
  card_time.setAttribute("data-open", "true");
}

function close_card_time(dont_save = false) {
  card_time_menu.style.opacity = "0";
  card_time_menu.style.pointerEvents = "none";
  card_time.style.backgroundColor = "var(--100)";
  card_time.style.color = "var(--text-muted)";
  var hour = hour_minute_input[0];
  var minute = hour_minute_input[1];
  var ampm = ampm_input;
  if (hour == "Nul") {
    hour = "Time";
  }
  if (minute == "Nl" || (hour == "Time" && minute !== "")) {
    minute = "";
  }
  if (minute == "Nl" || minute == "") {
    hour = "Time";
  }
  var colon = ":";
  if (hour == "Time") {
    colon = "";
    ampm = "";
  }
  card_time.childNodes[0].nodeValue = `${hour}${colon}${minute} ${ampm}`;
  if (!dont_save) {
    save_card_property("time", { "hour": hour, "minute": minute, "ampm": ampm });
  }
  card_time.setAttribute("data-open", "false");
}

var month_selection = document.querySelector(".month_selection");
var date_selection = document.querySelector(".date_selection");
var cdm_dropdowns = document.querySelectorAll(".cdm");
function set_cdm_dropdowns() {
  cdm_dropdowns.forEach(function (cdm) {
    cdm.addEventListener("scroll", cdm_scroll_handler);
    var active;
    Array.from(cdm.children).every(function (option) {
      if (scrolled_in(cdm, option)) {
        active = option;
        return false;
      }
      return true;
    });
    active.style.color = "var(--text-normal)";
  });
}

var hour_selection = document.querySelector(".hour_selection");
var minute_selection = document.querySelector(".minute_selection");
var ctm_dropdowns = document.querySelectorAll(".ctm");
function set_ctm_dropdowns() {
  ctm_dropdowns.forEach(function (ctm) {
    ctm.addEventListener("scroll", ctm_scroll_handler);
  });
}

function relative_to_parent(element) {
  var parent = element.parentElement.getBoundingClientRect();
  var child = element.getBoundingClientRect();
  var relative = {};
  (relative.top = child.top - parent.top), (relative.right = child.right - parent.right), (relative.bottom = child.bottom - parent.bottom), (relative.left = child.left - parent.left);
  return relative;
}

function scrolled_in(parent, element) {
  var rect = relative_to_parent(element);
  var top = rect.top;
  var bottom = rect.bottom;
  var visible = top >= 0 && bottom <= parent.clientHeight;
  return visible;
}

function cdm_set_active_color(target) {
  var selections = Array.from(target.children);
  var active;
  selections.every(function (option) {
    if (scrolled_in(target, option)) {
      active = option;
      return false;
    }
    return true;
  });
  selections.forEach(function (option) {
    option.style.color = "var(--text-muted)";
  });
  active.style.color = "var(--text-normal)";
  if (target == month_selection) {
    month_date_input[0] = active.textContent.trim();
  } else if (target == date_selection) {
    month_date_input[1] = active.textContent.trim();
  }
}

//var month_date_input = [{ textContent: "Date" }, { textContent: "" }];
var month_date_input = ["Date", ""];
var md_scroll_timer = null;
function cdm_scroll_handler(e) {
  if (md_scroll_timer !== null) {
    clearTimeout(md_scroll_timer);
  }
  md_scroll_timer = setTimeout(function () {
    cdm_set_active_color(e.target);
  }, 150);
}

function ctm_set_active_color(target) {
  var selections = Array.from(target.children);
  var active;
  selections.every(function (option) {
    if (scrolled_in(target, option)) {
      active = option;
      return false;
    }
    return true;
  });
  selections.forEach(function (option) {
    option.style.color = "var(--text-muted)";
  });
  active.style.color = "var(--text-normal)";
  if (target == hour_selection) {
    hour_minute_input[0] = active.textContent.trim();
  } else if (target == minute_selection) {
    hour_minute_input[1] = active.textContent.trim();
  }
}

var hour_minute_input = ["Time", ""];
var hm_scroll_timer = null;
function ctm_scroll_handler(e) {
  if (hm_scroll_timer !== null) {
    clearTimeout(hm_scroll_timer);
  }
  hm_scroll_timer = setTimeout(function () {
    ctm_set_active_color(e.target);
  }, 150);
}

var am = document.querySelector(".am_section").children[0];
var pm = document.querySelector(".pm_section").children[0];
am.addEventListener("click", ampm_handler);
pm.addEventListener("click", ampm_handler);

var ampm_input = "AM";
function ampm_handler(e) {
  var target = e.target;
  if (target == am) {
    ampm_input = "AM";
    am.style.backgroundColor = "var(--0)";
    am.style.color = "var(--text-normal)";
    pm.style.backgroundColor = "var(--100)";
    pm.style.color = "var(--text-muted)";
  } else if (target == pm) {
    ampm_input = "PM";
    pm.style.backgroundColor = "var(--0)";
    pm.style.color = "var(--text-normal)";
    am.style.backgroundColor = "var(--100)";
    am.style.color = "var(--text-muted)";
  }
}

// Add tag logic

var tags = document.querySelector(".tags");
var add_tag_btn = document.querySelector(".add_tag_btn");
var add_tag_container = document.querySelector(".add_tag_container");
var add_tag_input = document.querySelector(".add_tag_input");
var default_color = document.querySelector(".default");
var at_colors = Array.from(document.querySelectorAll(".color"));
var p_tag = document.querySelector(".p_tag");
var p_tag_name = document.querySelector(".p_tag_name");
var at_cancel = document.querySelector(".at_cancel");
var at_create = document.querySelector(".at_create");
var p_tag_color = "var(--d100)";

add_tag_btn.addEventListener("click", open_add_tag);
add_tag_input.addEventListener("input", update_tag_name);
at_cancel.addEventListener("click", at_btn_handler);
at_create.addEventListener("click", at_btn_handler);
at_colors.forEach(function (color) {
  color.addEventListener("click", update_tag_color);
});

function set_tags_x() {
  var tags_x = Array.from(document.querySelectorAll(".tag_x"));
  tags_x.forEach(function (x) {
    x.removeEventListener("click", delete_tag);
    x.addEventListener("click", delete_tag);
  });
}

function show_tags_x() {
  var tags_x = Array.from(document.querySelectorAll(".tag_x"));
  tags_x.forEach(function (x) {
    x.style.display = "block";
  });
}

function hide_tags_x() {
  var tags_x = Array.from(document.querySelectorAll(".tag_x"));
  tags_x.forEach(function (x) {
    x.style.display = "none";
  });
}

function delete_tag(e) {
  var parent = e.target.parentElement;
  parent.remove();
  if (tags.children.length == 0) {
    add_tag_btn.style.marginLeft = "-5px";
  }
  var tag_name = parent.children[0].textContent.trim();
  var column = card_active_column.children[0].children[0].children[0].textContent.trim();
  var event = card_active_event.children[0].children[1].textContent.trim();
  sendMain({ "delete_tag": [column, event, tag_name] });
}

function open_add_tag() {
  add_tag_input.style.pointerEvents = "auto";
  add_tag_container.style.opacity = "1";
  add_tag_container.style.pointerEvents = "auto";
  add_tag_input.value = "";
  update_tag_name();
  default_color.click();
  add_tag_input.focus();
  set_tags_x();
  add_tag_container.setAttribute("data-open", "true");
}

function cancel_add_tag() {
  add_tag_input.style.pointerEvents = "none";
  add_tag_container.style.opacity = "0";
  add_tag_container.style.pointerEvents = "none";
  add_tag_container.setAttribute("data-open", "false");
}

function update_tag_name() {
  p_tag_name.textContent = add_tag_input.value;
  if (add_tag_input.value == "") {
    p_tag_name.textContent = "Tag Name";
  }
}

var selected_tag_color = "default";
function update_tag_color(e) {
  at_colors.forEach(function (color) {
    color.children[0].style.opacity = "0";
  });
  e.target.children[0].style.opacity = "1";
  color = e.target.classList[1];
  selected_tag_color = color;
  color = color[0];
  p_tag_color = `var(--${color}100)`;
  p_tag.style.backgroundColor = p_tag_color;
}

function reset_add_tag_btn() {
  var tags = card_tags_container.children[0].children[0].children;
  if (tags.length == 0) {
    add_tag_btn.style.marginLeft = "-5px";
    return;
  }
  add_tag_btn.style.marginLeft = "0px";
}

function create_tag() {
  var tag_name = add_tag_input.value;
  if (tag_name == "") {
    return false;
  }
  var taken_names = Array.from(document.querySelectorAll(".tag_name"));
  var taken = false;
  taken_names.forEach(function (taken_name) {
    if (tag_name == taken_name.textContent.trim()) {
      taken = true;
    }
  });
  if (taken) {
    return false;
  }
  html_string = `
      <div class="tag" data-color="${p_tag_color}">
        <div class="tag_name">${tag_name}</div>
        <svg class="tag_x" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor"><path class="tag_x_path" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </div>`;
  var new_tag = create_element(html_string);
  tags.append(new_tag);
  add_tag_btn.style.marginLeft = "0px";
  var tag = tags.children;
  tag[tag.length - 1].style.backgroundColor = p_tag_color;
  set_tags_x();
  save_card_property("tags", { "name": tag_name, "color": selected_tag_color });
  return true;
}

function at_btn_handler(e) {
  if (e.target == at_create) {
    var ct = create_tag();
    if (!ct) {
      display_error("Invalid tag name");
      return;
    }
  }
  cancel_add_tag();
}

// END PAGE LOGIC HERE

// Disable keyboard shortcuts
window.onkeydown = function (e) {
  if (e.key == "Escape" || e.key == "Esc" || e.keyCode == 27) {
    close_card_container();
  }
  if ((e.ctrlKey || e.metaKey) && (e.which === 61 || e.which === 107 || e.which === 173 || e.which === 109 || e.which === 187 || e.which === 189)) {
    e.preventDefault();
  }
  // Disable zoom
  if ((e.keyCode == 173 || e.keyCode == 61) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable minimize and close
  if ((e.keyCode == 77 || e.keyCode == 87) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable reload
  // if ((e.keyCode == 82 || (e.keyCode == 82 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable inspect
  // if ((e.keyCode == 73 && e.shiftKey) && (e.ctrlKey || e.metaKey)) { e.preventDefault() }
  // Disable find in search
  if (e.keyCode == 70 && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable F1-F4 keys
  if (e.keyCode == 112 || e.keyCode == 113 || e.keyCode == 114 || e.keyCode == 115) {
    e.preventDefault();
  }
  // Disable F5-F8 keys
  if (e.keyCode == 116 || e.keyCode == 117 || e.keyCode == 118 || e.keyCode == 119) {
    e.preventDefault();
  }
  // Disable F9-F12 keys
  if (e.keyCode == 120 || e.keyCode == 121 || e.keyCode == 122 || e.keyCode == 123) {
    e.preventDefault();
  }
  // Disable undo, redo, select all
  // if ((e.keyCode == 90 || e.keyCode == 89 || e.keyCode == 65) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable cut, copy, and paste
  // if ((e.keyCode == 88 || e.keyCode == 67 || e.keyCode == 86) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable new tab, open last tab
  if ((e.keyCode == 84 || (e.keyCode == 84 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable source code, save page, history
  if ((e.keyCode == 85 || e.keyCode == 83 || e.keyCode == 72) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable open bookmarks
  if (e.keyCode == 79 && e.shiftKey && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable printing
  if ((e.keyCode == 80 || (e.keyCode == 80 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable find in search (with G)
  if ((e.keyCode == 71 || (e.keyCode == 71 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable downloads and devtools
  if ((e.keyCode == 74 || (e.keyCode == 74 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable new tab and new incognito tab
  if ((e.keyCode == 78 || (e.keyCode == 78 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
  }
  // Disable tabbing through elements
  if (e.keyCode == 9) {
    e.preventDefault();
  }
};
