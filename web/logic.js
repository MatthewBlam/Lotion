// https://codepen.io/MarianKoniuszko/pen/gOoJmaG

// GLOBAL VARIABLES

var platform;

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

  if (call == "sR.test()") {
    console.log(values["sR.test()"]);
  }

  if (call == "platform") {
    platform = values["platform"];
  }

  if (call == "open_card") {
    event_element = values["open_card"];
    open_card_container(event_element);
  }
});

// Send title button events
var window_close = document.querySelector(".close-btn");
var window_min = document.querySelector(".min-btn");
var window_max = document.querySelector(".max-btn");
var window_btns = document.querySelectorAll(".btn");

function set_window_btns() {
  window_btns.forEach(function (btn) {
    btn.addEventListener("click", window_btn_handler);
  });
}

function window_btn_handler(e) {
  var btn = e.target;
  if (btn == window_close) {
    sendMain({ "window_btn": "close" });
  }
  if (btn == window_min) {
    sendMain({ "window_btn": "min" });
  }
  if (btn == window_max) {
    sendMain({ "window_btn": "max" });
  }
}

// Startup tasks
document.addEventListener("DOMContentLoaded", init);
function init() {
  disable_spellcheck();
  set_window_btns();
  set_events();
  init_checkboxes();
  set_checkboxes();
  set_cdm_dropdowns();
  set_ctm_dropdowns();
  set_column_add_btns();
  set_column_option_menus();
}
//

// START PAGE LOGIC HERE

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
  console.log(elements);
  elements.forEach(function (element) {
    element.setAttribute("spellcheck", "false");
  });
}

// Universal page click handler
document.addEventListener("click", doc_handler);
document.addEventListener("keydown", doc_handler);
document.addEventListener("keypress", doc_handler);
function doc_handler(e) {
  if (e["type"] == "keydown") {
    if (e.keyCode === 9) {
      e.preventDefault();
    }
  }
  if (e["type"] == "keypress") {
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
    }
  }
  if (e["type"] == "click") {
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
  err_timeout = setTimeout(go_away, 5000);
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

// Searchbar logic
var searchbar = document.querySelector(".searchbar");
var searchbar_x = document.querySelector(".searchbar_x");
searchbar_x.addEventListener("click", reset_searchbar);

function reset_searchbar(e) {
  searchbar.value = "";
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

// Checkbox logic
function is_checked(checkbox) {
  if (checkbox.checked) {
    return true;
  }
  return false;
}

function init_checkboxes() {
  var checkboxes = document.getElementsByClassName("checkbox");
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].getAttribute("data-checked") == "false") {
      if (is_checked(checkboxes[i])) {
        checkboxes[i].click();
      }
      checkbox_handler({ target: checkboxes[i] });
    } else {
      if (!is_checked(checkboxes[i])) {
        checkboxes[i].click();
      }
      checkbox_handler({ target: checkboxes[i] });
    }
  }
}

function checkbox_handler(e) {
  var target = e.target;
  if (target.classList.contains("event_title")) {
    // target = get_sibling(target, "checkbox_container");
    // target = get_child(target, "checkbox");
    // target.click();
    return;
  }
  if (target.classList.contains("checkbox")) {
    var checkbox = get_sibling(target, "checkbox_indicator");
    var checkmark = get_sibling(target, "checkbox_checkmark");
    if (is_checked(target)) {
      checkbox.style.background = "var(--blue)";
      checkmark.style.opacity = "1";
      target.setAttribute("data-checked", "true");
      var title = get_sibling(target.parentElement, "event_title");
      var strike = get_child(title, "strike");
      setTimeout(function () {
        if (title.offsetWidth < title.scrollWidth) {
          strike.style.width = "97%";
        } else {
          strike.style.width = "200%";
        }
      }, 10);
      title.style.color = "var(--light-text-muted)";
      return;
    }
    checkbox.style.background = "var(--light-200)";
    checkmark.style.opacity = "0";
    target.setAttribute("data-checked", "false");
    var title = get_sibling(target.parentElement, "event_title");
    var strike = get_child(title, "strike");
    setTimeout(() => {
      strike.style.width = "0";
    }, 10);
    title.style.color = "var(--light-text-normal)";
  }
}

function set_checkboxes() {
  var events = document.getElementsByClassName("event");
  Array.from(events).forEach(function (event) {
    event.addEventListener("click", checkbox_handler);
  });
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
var options_btn = document.querySelector(".cb_options_btn");
var card_btns = Array.from(document.querySelectorAll("cbb"));
var card_tags_container = document.querySelector(".card_tags_container");

size_toggle.addEventListener("click", card_size_toggle);
function card_size_toggle(e) {
  if (card_container.getAttribute("data-size") == "small") {
    expand_btn.style.opacity = "0";
    contract_btn.style.opacity = "1";
    card_container.style.width = "75%";
    card_container.style.height = "75%";
    card_container.setAttribute("data-size", "large");
  } else if (card_container.getAttribute("data-size") == "large") {
    expand_btn.style.opacity = "1";
    contract_btn.style.opacity = "0";
    card_container.style.width = "50%";
    card_container.style.height = "50%";
    card_container.setAttribute("data-size", "small");
  }
}

function enable_card_edit() {
  card_title.setAttribute("contenteditable", "true");
  card_description.setAttribute("contenteditable", "true");
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
  if (lock_btn.getAttribute("data-locked") == "unlocked") {
    locked.style.opacity = "1";
    unlocked.style.opacity = "0";
    lock_btn.setAttribute("data-locked", "locked");
    disable_card_edit();
  } else if (lock_btn.getAttribute("data-locked") == "locked") {
    locked.style.opacity = "0";
    unlocked.style.opacity = "1";
    lock_btn.setAttribute("data-locked", "unlocked");
    enable_card_edit();
  }
}

favorite_btn.addEventListener("click", favorite_toggle);
function favorite_toggle(e) {
  if (favorite_btn.getAttribute("data-starred") == "unstarred") {
    favorite_btn.style.color = "rgb(235, 203, 139)";
    favorite_btn.setAttribute("fill", "rgb(235, 203, 139)");
    favorite_btn.setAttribute("data-starred", "starred");
  } else if (favorite_btn.getAttribute("data-starred") == "starred") {
    favorite_btn.style.color = "var(--light-icon-muted)";
    favorite_btn.setAttribute("fill", "none");
    favorite_btn.setAttribute("data-starred", "unstarred");
  }
}

screen_blur.addEventListener("click", close_card_container);

function open_card_container(event) {
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
  console.log(month_date_input);
  console.log(hour_minute_input);
  ampm_input = [time.ampm];
  tags.forEach(function (tag) {
    add_tag_input.value = tag.name;
    document.querySelector(`.${tag.color}`).click();
    create_tag();
  });
  var should_be_starred = favorite_btn.getAttribute("data-starred");
  if ((starred == "starred" && should_be_starred == "unstarred") || (starred == "unstarred" && should_be_starred == "starred")) {
    favorite_btn.click();
  }
  var should_be_locked = lock_btn.getAttribute("data-locked");
  if ((locked == "locked" && should_be_locked == "unlocked") || (locked == "unlocked" && should_be_locked == "locked")) {
    lock_btn.click();
  }
  card_container.style.opacity = "1";
  card_container.style.pointerEvents = "auto";
  card_btns.forEach(function (btn) {
    btn.style.pointerEvents = "auto";
  });
  card_title.style.pointerEvents = "auto";
  card_description.style.pointerEvents = "auto";
  card_date.style.pointerEvents = "auto";
  card_time.style.pointerEvents = "auto";
  add_tag_btn.style.pointerEvents = "auto";
  screen_blur.style.opacity = "1";
  screen_blur.style.pointerEvents = "auto";
}

function close_card_container(e) {
  card_container.style.opacity = "0";
  card_container.style.pointerEvents = "none";
  card_btns.forEach(function (btn) {
    btn.style.pointerEvents = "none";
  });
  card_title.style.pointerEvents = "none";
  card_description.style.pointerEvents = "none";
  card_date.style.pointerEvents = "none";
  card_time.style.pointerEvents = "none";
  add_tag_btn.style.pointerEvents = "none";
  screen_blur.style.opacity = "0";
  screen_blur.style.pointerEvents = "none";
}

// JSON MANAGMENT

function set_events() {
  var titles = document.querySelectorAll(".event_title");
  titles.forEach(function (title) {
    // title.removeEventListener("click", open_card_container_preamble);
    title.addEventListener("click", open_card_container_preamble);
  });
}

function open_card_container_preamble(e) {
  var target = e.target;
  var column = get_child(get_child(get_sibling(target.parentElement.parentElement.parentElement, "column_topbar"), "column_text"), "column_title").textContent;
  var title = target.textContent.trim();
  get_event(column, title);
}

function get_event(column, title) {
  sendMain({ "load_event": [column, title.trim()] });
}

// Column logic

function set_column_option_menus() {
  var menus = Array.from(document.querySelectorAll(".mi"));
  menus.forEach(function (menu) {
    menu.removeEventListener("mouseover", col_opt_handler);
    menu.removeEventListener("mouseout", col_opt_handler);
    menu.addEventListener("mouseover", col_opt_handler);
    menu.addEventListener("mouseout", col_opt_handler);
  });
}

var col_opt_rename_input = document.querySelector(".mi_input");
function col_opt_handler(e) {
  var target = e.target;
  var column_name = target.
  var loc = target.getBoundingClientRect();
  if (target.classList.contains("co_rename")) {
    col_opt_rename_input.style.top = `${loc.top}px`;
    col_opt_rename_input.style.left = `${loc.left + 116}px`;
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
  var column = get_child(get_sibling(e.target.parentElement, "column_text"), "column_title").textContent;
  var event_titles = Array.from(document.querySelectorAll(".event_title"));
  var et_count = 1;
  event_titles.forEach(function (title) {
    if (title.textContent.includes("New Event")) {
      et_count += 1;
    }
  });
  var title = "New Event";
  if (et_count > 1) {
    title = title + et_count.toString();
  }
  var html_string = `
    <div class="event">
      <div class="event_main">
        <div class="checkbox_container">
          <div class="checkbox_indicator"></div>
          <input class="checkbox" type="checkbox" data-checked="false" />
          <svg class="checkbox_checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="event_title">
          ${title}
          <div class="strike"></div>
        </div>
        <div class="event_date">Sep 10</div>
      </div>
      <div class="event_description">This is the short description</div>
    </div>`;
  new_event = create_element(html_string);
  new_event.addEventListener("click", open_card_container_preamble);
  list.append(new_event);
  sendMain({ "register_event": [column, title] });
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
  if (e["type"] == "keypress") {
    if (enter_pressed(e.keyCode)) {
      e.preventDefault();
      target.blur();
    }
  }
  if (e["type"] == "focusout") {
    target.scrollTop = "0";
    target.scrollLeft = "0";
    target.style.overflowX = "hidden";
    target.style.textOverflow = "ellipsis";
  }
  if (e["type"] == "focus") {
    target.scrollTop = "0";
    target.scrollLeft = "0";
    target.style.overflowX = "scroll";
    target.style.textOverflow = "inherit";
  }
}

// Date / time menu logic

var card_date = document.querySelector(".card_date");
var card_date_menu = document.querySelector(".cdm_container");
card_date.addEventListener("click", open_card_date);

function open_card_date(e) {
  card_date_menu.style.opacity = "1";
  card_date_menu.style.pointerEvents = "auto";
  card_date.style.backgroundColor = "var(--light-200)";
  card_date.style.color = "var(--light-text-normal)";
  card_date.setAttribute("data-open", "true");
}
function close_card_date() {
  card_date_menu.style.opacity = "0";
  card_date_menu.style.pointerEvents = "none";
  card_date.style.backgroundColor = "var(--light-100)";
  card_date.style.color = "var(--light-text-muted)";
  var month = month_date_input[0];
  var date = month_date_input[1];
  if (month == "Nul") {
    month = "Date";
  }
  if (date == "Nl" || (month == "Date" && date !== "")) {
    date = "";
  }
  card_date.childNodes[0].nodeValue = `${month} ${date}`;
  card_date.setAttribute("data-open", "false");
}

var card_time = document.querySelector(".card_time");
var card_time_menu = document.querySelector(".ctm_container");
card_time.addEventListener("click", open_card_time);

function open_card_time(e) {
  card_time_menu.style.opacity = "1";
  card_time_menu.style.pointerEvents = "auto";
  card_time.style.backgroundColor = "var(--light-200)";
  card_time.style.color = "var(--light-text-normal)";
  card_time.setAttribute("data-open", "true");
}

function close_card_time() {
  card_time_menu.style.opacity = "0";
  card_time_menu.style.pointerEvents = "none";
  card_time.style.backgroundColor = "var(--light-100)";
  card_time.style.color = "var(--light-text-muted)";
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
    active.style.color = "var(--light-text-normal)";
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

var month_date_input = [{ textContent: "Date" }, { textContent: "" }];
var md_scroll_timer = null;
function cdm_scroll_handler(e) {
  if (md_scroll_timer !== null) {
    clearTimeout(md_scroll_timer);
  }
  md_scroll_timer = setTimeout(function () {
    var selections = Array.from(e.target.children);
    var active;
    selections.every(function (option) {
      if (scrolled_in(e.target, option)) {
        active = option;
        return false;
      }
      return true;
    });
    selections.forEach(function (option) {
      option.style.color = "var(--light-text-muted)";
    });
    active.style.color = "var(--light-text-normal)";
    if (e.target == month_selection) {
      month_date_input[0] = active;
    } else if (e.target == date_selection) {
      month_date_input[1] = active;
    }
  }, 150);
}

var hour_minute_input = [{ textContent: "Time" }, { textContent: "" }];
var hm_scroll_timer = null;
function ctm_scroll_handler(e) {
  if (hm_scroll_timer !== null) {
    clearTimeout(hm_scroll_timer);
  }
  hm_scroll_timer = setTimeout(function () {
    var selections = Array.from(e.target.children);
    var active;
    selections.every(function (option) {
      if (scrolled_in(e.target, option)) {
        active = option;
        return false;
      }
      return true;
    });
    selections.forEach(function (option) {
      option.style.color = "var(--light-text-muted)";
    });
    active.style.color = "var(--light-text-normal)";
    if (e.target == hour_selection) {
      hour_minute_input[0] = active;
    } else if (e.target == minute_selection) {
      hour_minute_input[1] = active;
    }
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
    am.style.backgroundColor = "var(--light-0)";
    am.style.color = "var(--light-text-normal)";
    pm.style.backgroundColor = "var(--light-100)";
    pm.style.color = "var(--light-text-muted)";
  } else if (target == pm) {
    ampm_input = "PM";
    pm.style.backgroundColor = "var(--light-0)";
    pm.style.color = "var(--light-text-normal)";
    am.style.backgroundColor = "var(--light-100)";
    am.style.color = "var(--light-text-muted)";
  }
}

// Add tag logic

var tags = document.querySelector(".tags");
var add_tag_btn = document.querySelector(".add_tag_btn");
var add_tag_container = document.querySelector(".add_tag_container");
var add_tag_input = document.querySelector(".add_tag_input");
var default_color = document.querySelector(".grey");
var at_colors = Array.from(document.querySelectorAll(".color"));
var p_tag = document.querySelector(".p_tag");
var p_tag_name = document.querySelector(".p_tag_name");
var at_cancel = document.querySelector(".at_cancel");
var at_create = document.querySelector(".at_create");
var p_tag_color = "var(--light-100)";

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
  e.target.parentElement.remove();
  if (tags.children.length == 0) {
    add_tag_btn.style.marginLeft = "-5px";
  }
}

function open_add_tag() {
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

function update_tag_color(e) {
  at_colors.forEach(function (color) {
    color.children[0].style.opacity = "0";
  });
  e.target.children[0].style.opacity = "1";
  color = e.target.classList[1];
  if (color == "grey") {
    color = "light-";
  } else {
    color = color[0];
  }
  p_tag_color = `var(--${color}100)`;
  p_tag.style.backgroundColor = p_tag_color;
}

function create_tag() {
  if (add_tag_input.value == "") {
    return false;
  }
  html_string = `
      <div class="tag">
        <div class="tag_name">${add_tag_input.value}</div>
        <svg class="tag_x" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor"><path class="tag_x_path" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </div>`;
  var new_tag = create_element(html_string);
  tags.append(new_tag);
  add_tag_btn.style.marginLeft = "0px";
  tag = tags.children;
  tag[tag.length - 1].style.backgroundColor = p_tag_color;
  set_tags_x();
  return true;
}

function at_btn_handler(e) {
  if (e.target == at_create) {
    var ct = create_tag();
    if (!ct) {
      display_error("Invalid tag name");
    }
  }
  cancel_add_tag();
}

// END PAGE LOGIC HERE

// Disable keyboard shortcuts
window.onkeydown = function (e) {
  if (e.key == "Escape" || e.key == "Esc" || e.keyCode == 27) {
    // Close card
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
  // if (e.keyCode == 9) { e.preventDefault(); }
};
