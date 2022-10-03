// https://codepen.io/MarianKoniuszko/pen/gOoJmaG

// GLOBAL VARIABLES

var platform;

// GLOBAL VARIABLES

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

  if (call == 'sR.platform()') {
    platform = values['sR.platform()'];
  }
});



// HTML/CSS DEPENDENT LOGIC START


// PLATFORM START

function get_platform() {
    sendMain({'sM.platform()': 'null'});
}

// PLATFORM END


// ERROR START

var error_message = document.getElementById('error_message');
var em_txt = document.getElementById('em_txt');
var err_timeout;

function display_error(message) {
    clearTimeout(err_timeout);
    function go_away(){
        error_message.style.opacity = '0';
    }
    em_txt.textContent = message;
    error_message.style.opacity = '1';
    err_timeout = setTimeout(go_away, 5000);
}

// ERROR END


// UNIVERSAL CLICK HANDLER START

document.addEventListener('click', universal_handler);
document.addEventListener('keyup', universal_handler);

function universal_handler(e) {
    if (e['type'] == 'click') {
        filter_handler({target: e.target});
        close_column_menu({target: e.target});
        if (add_column.getAttribute('data-open') == 'true') {
            close_add_column();
        }
    }
    if (e['type'] == 'keyup') {
        var dcc_visible = window.getComputedStyle(delete_column_confirm).opacity == '1';
        var ect_visible = window.getComputedStyle(edit_column_title).opacity == '1';
        var tag_visible = window.getComputedStyle(create_tag_window).opacity == '1';
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (dcc_visible) {
                dcc_delete_btn.click();
            }
            if (ect_visible) {
                ect_ok_btn.click();
            }
            if (tag_visible) {
                create_tag_btn.click();
            }
        }
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (dcc_visible) {
                dcc_cancel_btn.click();
            }
            if (ect_visible) {
                ect_cancel_btn.click();
            }
            if (tag_visible) {
                cancel_tag_btn.click();
            }
        }
    }
}

var entire_columns = document.getElementsByClassName('columns')[0];
window.oncontextmenu = function(e) {
    var bb = entire_columns.getBoundingClientRect();
    var x = e.clientX;
    var y = e.clientY;
    var inside_x = x > bb.left && x < bb.right;
    var inside_y = y > bb.top && y < bb.bottom;
    if (inside_x && inside_y) {
        open_add_column(x, y);
    }
}

// UNIVERSAL CLICK HANDLER END


// SCREEN BLUR START

var screen_blur = document.getElementById('screen_blur');
var column_screen_blur = document.getElementById('column_screen_blur');

function open_screen_blur() {
    screen_blur.style.opacity = '1';
    screen_blur.style.pointerEvents = 'auto';
}

function close_screen_blur() {
    screen_blur.style.opacity = '0';
    screen_blur.style.pointerEvents = 'none';
}

function open_column_screen_blur() {
    column_screen_blur.style.opacity = '1';
    column_screen_blur.style.pointerEvents = 'auto';
}

function close_column_screen_blur() {
    column_screen_blur.style.opacity = '0';
    column_screen_blur.style.pointerEvents = 'none';
}

// SCREEN BLUR END


// CHECKBOXES START

// On start, check attributes to set checkbox check-state
function set_checkboxes() {
    var inputs = document.getElementsByClassName('check');
    console.log(inputs);
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute('data-checked') == 'false') {
            if (is_checked(inputs[i])) {
                inputs[i].click();
            }
            checkbox_handler({target: inputs[i]});
        } else {
            if (!is_checked(inputs[i])) {
                inputs[i].click();
            }
            checkbox_handler({target: inputs[i]});
        }
    }
}

// Check if given argument is checked
function is_checked(checkbox) {
    if (checkbox.checked) {
        console.log('checked', checkbox);
       return true;
    }
    console.log('not-checked', checkbox);
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


// FILTER START

var filter = document.getElementsByClassName('filter_container')[0];
var filter_options = document.getElementsByClassName('filter_options')[0];
var filter_icon = document.getElementsByClassName('filter_icon')[0];
filter.addEventListener('click', filter_handler);

function filter_handler(e) {
    if (e.target == filter || e.target.parentElement == filter) {
        filter_options.style.transform = 'scaleY(1)';
        filter_options.style.opacity = '1';
        filter_options.style.pointerEvents = 'auto';
        filter_options.setAttribute('data-open', 'true');
        filter_icon.style.transform = 'rotate(180deg)';
        return;
    }
    if (filter_options.getAttribute('data-open') == 'true') {
        filter_options.style.transform = 'scaleY(0.5)';
        filter_options.style.opacity = '0';
        filter_options.style.pointerEvents = 'none';
        filter_options.setAttribute('data-open', 'false');
        filter_icon.style.transform = 'rotate(0deg)';
    }
}

// FILTER END


// SEARCHBAR START

var searchbar_input = document.getElementsByClassName('searchbar')[0];
var search_x = document.getElementsByClassName('search_x')[0];
search_x.addEventListener('click', search_x_handler);

function search_x_handler(e) {
    searchbar_input.value = '';
}

// SEARCHBAR END


// COLUMN COUNT START

function is_overflowing(element) {
    if (element.scrollWidth > element.offsetWidth) {
        return true;
    }
    return false;
}

window.addEventListener ('resize', resize_count);
function resize_count(e) {
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


// COLUMN OPTIONS START

var edit_column_title = document.getElementById('edit_column_title');
var delete_column_confirm = document.getElementById('delete_column_confirm');
var action_btns = document.getElementsByClassName('action_icon');
var cbo_btns = document.getElementsByClassName('cbo');

function set_cb_options_listeners(){
    for (var i = 0; i < action_btns.length; i++) {
        action_btns[i].addEventListener('click', open_column_menu);
    }
    for (var i = 0; i < cbo_btns.length; i++) {
        cbo_btns[i].addEventListener('click', cbo_handler);
    }
}

var ect_txt = document.getElementsByClassName('ect_txt')[0];
var ect_input = document.getElementById('edit_column_title_input');
var ect_cancel_btn = document.getElementsByClassName('ect_cancel')[0];
var ect_ok_btn = document.getElementsByClassName('ect_ok')[0];
ect_cancel_btn.addEventListener('click', close_cbo_edit);
ect_ok_btn.addEventListener('click', close_cbo_edit);

var dcc_txt = document.getElementsByClassName('dcc_txt')[0];
var dcc_cancel_btn = document.getElementsByClassName('dcc_cancel')[0];
var dcc_delete_btn = document.getElementsByClassName('dcc_delete')[0];
dcc_cancel_btn.addEventListener('click', close_dcc_delete);
dcc_delete_btn.addEventListener('click', close_dcc_delete);

function open_cbo_edit() {
    ect_input.value = '';
    ect_txt.textContent = ect_ok_btn.columnTitle.textContent;
    edit_column_title.style.opacity = '1';
    edit_column_title.style.pointerEvents = 'auto';
    ect_input.focus();
    open_column_screen_blur();
}

function close_cbo_edit(e) {
    if (e.target == ect_cancel_btn) {
        edit_column_title.style.opacity = '0';
        edit_column_title.style.pointerEvents = 'none';
    }
    if (e.target == ect_ok_btn) {
        if (ect_input.value !== '') {
            ect_ok_btn.columnTitle.textContent = ect_input.value;
        }
        edit_column_title.style.opacity = '0';
        edit_column_title.style.pointerEvents = 'none';
        resize_count(null);
    }
    close_column_screen_blur();
}

function open_dcc_delete() {
    dcc_txt.textContent = `Delete "${dcc_delete_btn.columnTitle.textContent}"?`;
    delete_column_confirm.style.opacity = '1';
    delete_column_confirm.style.pointerEvents = 'auto';
    open_column_screen_blur();
}

function close_dcc_delete(e) {
    if (e.target == dcc_cancel_btn) {
        delete_column_confirm.style.opacity = '0';
        delete_column_confirm.style.pointerEvents = 'none';
    }
    if (e.target == dcc_delete_btn) {
        var column = dcc_delete_btn.columnTitle.parentElement.parentElement;
        setTimeout(() => {
            column.remove();
        }, 250);
        delete_column_confirm.style.opacity = '0';
        delete_column_confirm.style.pointerEvents = 'none';
        resize_count(null);
    }
    close_column_screen_blur();
}

function cbo_handler(e) {
    var target = e.target;
    if (target.classList.contains('cboi')) {
        target = target.parentElement;
    }
    if (target.classList.contains('cboi2')) {
        target = target.parentElement.parentElement;
    }
    if (target.classList.contains('cbo_edit')) {
        ect_ok_btn.columnTitle = target.parentElement.parentElement.parentElement.childNodes[1];
        open_cbo_edit();
    }
    if (target.classList.contains('cbo_delete')) {
        dcc_delete_btn.columnTitle = target.parentElement.parentElement.parentElement.childNodes[1];
        open_dcc_delete();
    }
}

function get_cb_options(child) {
    return child.parentElement.childNodes[5];
}

function open_column_menu(e) {
    var target = e.target;
    if (!target.classList.contains('action_icon')) {
        var target = e.target.parentElement;
    }
    var cb_options = get_cb_options(target);
    cb_options.style.opacity = '1';
    cb_options.style.pointerEvents = 'auto';
    cb_options.setAttribute('data-open', 'true');
}

function close_column_menu(e) {
    var target = e.target;
    var except = false;
    if (target.classList.contains('action_icon')) {
        var except = get_cb_options(target);
    }
    if (target.parentElement.classList.contains('action_icon')) {
        var except = get_cb_options(target.parentElement);
    }
    var cb_options = document.getElementsByClassName('cb_options');
    for (var i = 0; i < cb_options.length; i++) {
        if (cb_options[i].getAttribute('data-open') == 'true') {
            if (except == cb_options[i]) {
                continue;
            }
            cb_options[i].style.opacity = '0';
            cb_options[i].style.pointerEvents = 'none';
            cb_options[i].setAttribute('data-open', 'false');
        }
    }
}

// COLUMN OPTIONS END


// ADD COLUMN START

var add_column = document.getElementById('add_column');
add_column.addEventListener('click', append_column);

function open_add_column(x, y) {
    add_column.style.top = `${y - 4}px`
    add_column.style.left = `${x + 14}px`
    add_column.style.opacity = '1'
    add_column.style.pointerEvents = 'auto';
    add_column.setAttribute('data-open', 'true');
}

function close_add_column() {
    add_column.style.opacity = '0'
    add_column.style.pointerEvents = 'none';
    add_column.setAttribute('data-open', 'false');
}

function create_element(html_string) {
    var div = document.createElement('div');
    div.innerHTML = html_string.trim();
    return div.firstChild;
}

function append_column() {
    var columns = entire_columns.childNodes;
    var children = [];
    for (var i = 0; i < columns.length; i++) {
        try {
            columns[i].classList.contains('column');
            children.push(columns[i]);
        }
        catch {}
    }
    if (children.length == 4) {
        display_error('Max Column Limit Reached');
        return;
    }
    var new_column = `
        <div class='column'>
            <div class='column_top column_category'>
                <span class='column_title'>This Week</span>
                <span class='column_count'>7</span>
                <div class='column_btns'>
                    <svg class='action_icon cb' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'> <path stroke-linecap='round' stroke-linejoin='round' d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z' /></svg>
                    <svg class='add_icon cb' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M12 6v12m6-6H6' /></svg>
                    <div class='cb_options' data-open='false'>
                        <div class='cbo_edit cbo'>
                            <svg class='cbo_edit_icon cboi' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'> <path class='cboi2' d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'> </path></svg>
                            <span class='cbo_edit_txt cboi'>Edit</span>
                        </div>
                        <div class='cbo_delete cbo'>
                            <svg class='cbo_delete_icon cboi' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path class='cboi2' fill-rule='evenodd' d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z' clip-rule='evenodd'></path></svg>
                            <span class='cbo_delete_txt cboi'>Delete</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class='column_list column_category'>
                <ul class='list'>
                    <li class='list_item'>
                        <div class='checkbox'>
                            <div class='checkbox_indicator'></div>
                            <svg class='checkbox_checkmark' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'> <path stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 13l4 4L19 7'></path></svg>
                            <input class='check' type='checkbox' data-checked='false' />
                        </div>
                        <span class='name_info'>Eat Pizza And Play With Kacy Chungus</span>
                        <div class='time_info'>Monday, Sept 5, 12:00 PM </div>
                    </li>
                    <li class='list_item'>
                        <div class='checkbox'>
                            <div class='checkbox_indicator'></div>
                            <svg class='checkbox_checkmark' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'> <path stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 13l4 4L19 7'></path></svg>
                            <input class='check' type='checkbox' data-checked='false' />
                        </div>
                        <span class='name_info'>Practice Music</span>
                        <div class='time_info'>Monday, Sept 5, 4:00 PM </div>
                    </li>
                </ul>
            </div>
        </div>
    `
    entire_columns.append(create_element(new_column));
    resize_count();
    set_cb_options_listeners();
    set_cb_add_listeners();
    set_checkboxes();
    watch_checkboxes();
}

// ADD COLUMN END


// ADD LIST ITEM START

var add_btns = document.getElementsByClassName('add_icon');
function set_cb_add_listeners() {
    for (var i = 0; i < add_btns.length; i++) {
        add_btns[i].addEventListener('click', add_list_item);
    }
}

function add_list_item(e) {
    var target = e.target;
    if (!target.classList.contains('add_icon')) {
        target = target.parentElement;
    }
    var column = target.parentElement.parentElement.parentElement;
    var column_list = column.childNodes[3].childNodes[1];
    var new_list_item = `
        <li class='list_item' style='opacity: 0'>
            <div class='checkbox'>
                <div class='checkbox_indicator'></div>
                <svg class='checkbox_checkmark' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'> <path stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 13l4 4L19 7'></path></svg>
                <input class='check' type='checkbox' data-checked='false' />
            </div>
            <span class='name_info'>New Event</span>
            <div class='time_info'>Monday, Sept 5, 12:00 PM </div>
        </li>
    `
    var item = create_element(new_list_item)
    column_list.append(item);
    setTimeout(() => {
        item.style.opacity = '1';
    }, 100);
    var date = new Date();
    console.log(item, date);
}


// ADD LIST ITEM END


// EDIT LIST ITEM START



// EDIT LIST ITEM END


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
    standard += (minutes < 10) ? ':0' + minutes : ':' + minutes;
    standard += (hours >= 12) ? ' PM' : ' AM';
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

// TAGS START

var tags = document.getElementById('tags');
var add_tag = document.getElementById('add_tag');
var create_tag_window = document.getElementById('create_tag');
var cancel_tag_btn = document.getElementById('ct_cancel');
var create_tag_btn = document.getElementById('ct_create');
var tag_name_input = document.getElementById('tag_name_input');
var tag_colors = document.getElementsByClassName('color');
var tag_preview_color = document.getElementById('tp');
var tag_preview_txt = tag_preview_color.childNodes[1];

add_tag.addEventListener('click', open_create_tag_window);
cancel_tag_btn.addEventListener('click', close_create_tab_window);
create_tag_btn.addEventListener('click', close_create_tab_window);

function open_create_tag_window(e) {
    create_tag.style.pointerEvents = 'auto';
    create_tag.style.opacity = '1';
    reset_tag_name();
    reset_tag_colors();
    tag_name_input.focus();
}

function close_create_tab_window(e) {
    create_tag.style.pointerEvents = 'none';
    create_tag.style.opacity = '0';
    if (e.target == create_tag_btn) {
        if (tag_name_input.value == '') {
            return;
        }
        var name_raw = tag_name_input.value
        var name = name_raw.split(' ').join('_');
        var name_already_used = document.getElementsByClassName(`${name}_tag`).length > 0;
        if (name_already_used) {
            display_error('Tag Name Already In Use');
            return;
        }
        tags.innerHTML += `
            <div class='tag'>
                <span class='tag_txt ti ${name}_tag'>${name_raw}</span>
                <svg class='tag_x ti' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 18L18 6M6 6l12 12'></path></svg>
            </div>`;
        var new_tag = document.getElementsByClassName(`${name}_tag`)[0];
        var colors = document.getElementsByClassName('color_check');
        for (var i = 0; i < colors.length; i++) {
            var visible = parseInt(window.getComputedStyle(colors[i]).opacity);
            if (visible == 1) {
                var color = colors[i].parentElement.classList[1];
                new_tag.parentElement.style.backgroundColor = `var(--tc_${color})`;
                new_tag.style.color = `var(--tt_${color})`;
                new_tag.parentElement.childNodes[3].style.color = `var(--tt_${color})`;
            }
        }
        add_tag.classList.remove('add_tag_margin');
        setTimeout(() => {
            add_tag.classList.add('add_tag_margin');
        }, 5);
    }
}

tag_name_input.addEventListener('input', update_tag_preview_name);
for (var i = 0; i < tag_colors.length; i++) {
    tag_colors[i].addEventListener('click', tag_color_handler);
}

function update_tag_preview_name(e) {
    if (tag_name_input.value == '') {
        tag_preview_txt.textContent = 'Tag Name';
        return;
    }
    tag_preview_txt.textContent = tag_name_input.value;
}

function tag_color_handler(e) {
    var color = e.target.classList[1];
    tag_preview_color.style.backgroundColor = 'var(--tc_' + color + ')';
    tag_preview_txt.style.color = 'var(--tt_' + color + ')';
    for (var i = 0; i < tag_colors.length; i++) {
        if (tag_colors[i] == e.target) {
            tag_colors[i].childNodes[1].style.opacity = '1';
            continue;
        }
        tag_colors[i].childNodes[1].style.opacity = '0';
    }
}

function reset_tag_name() {
    tag_name_input.value = '';
    update_tag_preview_name();
}

function reset_tag_colors() {
    var gray = document.getElementsByClassName('gray')[0];
    gray.click();
}

// TAGS END

// MANAGE CARD START

var card_container = document.getElementById('card_container');
var card_description = document.getElementById('card_description');
var dropdowns = document.getElementsByClassName('dropdown');
var edit_save = document.getElementById('edit_save');
var delete_cancel = document.getElementById('delete_cancel');

function reset_add_tag() {
    add_tag.style.marginLeft = '0px';
}

function reset_card_text() {
    card_title.style.pointerEvents = 'auto';
    card_description.pointerEvents = 'auto';
    card_title.style.userSelect = 'auto';
    card_description.userSelect = 'auto';
}

function open_card() {
    reset_add_tag();
    reset_card_text();
    card_container.style.transform = 'translate(-50%, -50%)';
}
function close_card() {
    card_container.style.transform = 'translate(-50%, -500%)';
}

function make_card_editable() {
}

// MANAGE CARD END


// HTML/CSS DEPENDENT LOGIC END



// Startup tasks
document.addEventListener('DOMContentLoaded', init);
function init() {
    get_platform();
    set_checkboxes();
    watch_checkboxes();
    resize_count();
    init_card_dropdowns();
    update_time_field();
    set_cb_options_listeners();
    set_cb_add_listeners();
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
  // if (e.keyCode == 9) { e.preventDefault(); }
}
