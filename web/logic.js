// https://codepen.io/MarianKoniuszko/pen/gOoJmaG

// Sleep function for pauses
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
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
  window.api.send('toMain', JSON.stringify(message));
}

// Receive message from node script
window.api.receive('toRender', (data) => {
  var values = JSON.parse(data);
  var keys = Object.keys(values);
  var call = keys[0];

  if (call == 'sR.test()') {
    console.log(values['sR.test()'])
  }
});



// HTML/CSS DEPENDENT LOGIC START


// CHECKBOXES START

// On start, check attributes to set checkbox check-state
function set_checkboxes() {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == 'checkbox') {
            if (inputs[i].getAttribute('data-checked') == 'false') {
                checkbox_handler({target: inputs[i]});
            } else {
                inputs[i].click();
                checkbox_handler({target: inputs[i]});
            }
        }
    }
}

// Check if given argument is checked
function is_checked(checkbox) {
    if (checkbox.checked) {
       return true;
    }
    return false;
}

// On start, add event listeners to every checkbox to handle clicks
function checkbox_handler(e) {
    if (e.target.classList.contains('check')) {
        var checkbox = e.target.parentElement.childNodes[1];
        var checkmark = e.target.parentElement.childNodes[3];
        if (is_checked(e.target)) {
            checkbox.style.background = 'var(--blue1)';
            checkmark.style.opacity = '1';
            e.target.setAttribute('data-checked', 'true')
            return
        }
        checkbox.style.background = 'var(--dark0)';
        checkmark.style.opacity = '0';
        e.target.setAttribute('data-checked', 'false')
    }
}
function watch_checkboxes() {
    var lists = document.getElementsByClassName('list');
    for (var i = 0; i < lists.length; i++) {
        lists[i].addEventListener('click', checkbox_handler);
    }
}

// CHECKBOXES END


// COLUMN COUNT START

function is_overflowing(element) {
    if (element.scrollWidth > element.offsetWidth) {
        return true;
    }
    return false;
}

window.addEventListener ('resize', resize);
function resize(e) {
    var titles = document.getElementsByClassName('column_title');
    for (var i = 0; i < titles.length; i++) {
        var count = titles[i].parentElement.childNodes[3];
        if (is_overflowing(titles[i])) {
            count.style.marginLeft = '0px';
        } else {
            count.style.marginLeft = '3px';
        }
    }
}

// COLUMN COUNT END


// CARD TITLE START

var card_title = document.getElementById('card_title');
card_title.addEventListener('click', toggle_card_title);
card_title.addEventListener('blur', toggle_card_title);
function toggle_card_title(e) {
    if (e['type'] == 'click') {
        card_title.readonly = false;
    }
    if (e['type'] == 'blur') {
        card_title.readonly = true;
    }
}

// CARD TITLE END


// CARD DROPDOWNS START

function close_dropdowns(exclude) {
    var options = document.getElementsByClassName('dropdown_options');
    for (var i = 0; i < options.length; i++) {
        if (options[i] == exclude[0]) {
            continue;
        }
        options[i].style.overflowY = 'hidden';
        options[i].style.transform = 'scaleY(0.5)';
        options[i].style.opacity = '0';
        options[i].style.pointerEvents = 'none';
        options[i].setAttribute('data-open', 'false')
    }
    var carets = document.getElementsByClassName('caret_down');
    for (var i = 0; i < carets.length; i++) {
        if (carets[i] == exclude[1]) {
            continue;
        }
        carets[i].style.transform = 'translateY(-50%) rotate(90deg)';
    }
}

function dropdown_handler(e) {
    var target = e.target;
    if (target.classList.contains('dropdown')) {
        var caret = target.childNodes[1];
        var options = target.parentElement.childNodes[3];
        var visible = options.getAttribute('data-open');
        if (visible == 'false') {
            options.style.transform = 'scaleY(1)';
            options.style.opacity = '1';
            options.style.pointerEvents = 'auto';
            options.style.overflowY = 'scroll';
            options.setAttribute('data-open', 'true');
            caret.style.transform = 'translateY(-50%) rotate(270deg)';
        }
        close_dropdowns([options, caret]);
    }
    else if (target.classList.contains('dropdown_options')) {
        // pass
    }
    else {
        close_dropdowns([null, null]);
    }
}

function init_card_dropdowns() {
    var dropdowns = document.getElementsByClassName('card_info');
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener('click', dropdown_handler);
    }
    var card_container = document.getElementById('card_container');
    card_container.addEventListener('click', dropdown_handler);
}

// CARD DROPDOWNS END


// CARD TIME INPUT START

function convert_time(military) {
    military = military.split(':');
    var hours = parseInt(military[0]);
    var minutes = parseInt(military[1]);
    var standard;
    if (hours > 0 && hours <= 12) {
        standard = '' + hours;
    }
    else if (hours > 12) {
        standard = '' + (hours - 12);
    }
    else if (hours == 0) {
        standard = '12';
    }
    standard += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    standard += (hours >= 12) ? " PM" : " AM";
    return standard;
}

var time_value =  document.getElementById('time_value');
var incrementer = document.getElementById('time_incrementer');
function update_time_field(direction) {
    if (direction == 'up') {
        incrementer.stepUp(1);
        if (incrementer.value == '23:55') {
            incrementer.value = '00:00'
        }
    }
    else if (direction == 'down') {
        incrementer.stepDown(1);
        if (incrementer.value == '00:00') {
            incrementer.value = '23:55'
        }
    }
    console.log(incrementer.value);
    standard_time = convert_time(incrementer.value)
    time_value.innerHTML = standard_time;
}

var time_field = document.getElementById('time');
var caret_right = document.getElementById('caret_right');
var caret_left = document.getElementById('caret_left');
time_field.addEventListener('wheel', time_scroll)
caret_right.addEventListener('click', caret_right_handler)
caret_left.addEventListener('click', caret_left_handler)

function time_scroll(e) {
    if (e.deltaY < 0) {
        update_time_field('down');
    }
    else if (e.deltaY > 0) {
        update_time_field('up');
    }
}

function caret_right_handler(e) {
    update_time_field('up');
}

function caret_left_handler(e) {
    update_time_field('down');
}

// CARD TIME INPUT END


// HTML/CSS DEPENDENT LOGIC END



// Startup tasks
document.addEventListener('DOMContentLoaded', init);
function init() {
    set_checkboxes();
    watch_checkboxes();
    resize();
    init_card_dropdowns();
    update_time_field();
}

// Disable keyboard shortcuts
window.onkeydown = function (e) {
  if (e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) {
    // Close card
  }
  if ((e.ctrlKey || e.metaKey) && (e.which === 61 || e.which === 107 || e.which === 173 || e.which === 109 || e.which === 187 || e.which === 189)) {
    e.preventDefault();
  }
  // Disable zoom
  if ((e.keyCode == 173 || e.keyCode == 61) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable minimize and close
  if ((e.keyCode == 77 || e.keyCode == 87) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable reload
  // if ((e.keyCode == 82 || (e.keyCode == 82 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable inspect
  // if ((e.keyCode == 73 && e.shiftKey) && (e.ctrlKey || e.metaKey)) { e.preventDefault() }
  // Disable find in search
  if ((e.keyCode == 70) && (e.ctrlKey || e.metaKey)) { e.preventDefault() }
  // Disable F1-F4 keys
  if (e.keyCode == 112 || e.keyCode == 113 || e.keyCode == 114 || e.keyCode == 115) { e.preventDefault(); }
  // Disable F5-F8 keys
  if (e.keyCode == 116 || e.keyCode == 117 || e.keyCode == 118 || e.keyCode == 119) { e.preventDefault(); }
  // Disable F9-F12 keys
  if (e.keyCode == 120 || e.keyCode == 121 || e.keyCode == 122 || e.keyCode == 123) { e.preventDefault(); }
  // Disable undo, redo, select all
  // if ((e.keyCode == 90 || e.keyCode == 89 || e.keyCode == 65) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable cut, copy, and paste
  // if ((e.keyCode == 88 || e.keyCode == 67 || e.keyCode == 86) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable new tab, open last tab
  if ((e.keyCode == 84 || (e.keyCode == 84 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable source code, save page, history
  if ((e.keyCode == 85 || e.keyCode == 83 || e.keyCode == 72) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable open bookmarks
  if ((e.keyCode == 79 && e.shiftKey) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable printing
  if ((e.keyCode == 80 || (e.keyCode == 80 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable find in search (with G)
  if ((e.keyCode == 71 || (e.keyCode == 71 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable downloads and devtools
  if ((e.keyCode == 74 || (e.keyCode == 74 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable new tab and new incognito tab
  if ((e.keyCode == 78 || (e.keyCode == 78 && e.shiftKey)) && (e.ctrlKey || e.metaKey)) { e.preventDefault(); }
  // Disable tabbing through elements
  if (e.keyCode == 9) { e.preventDefault(); }
}
