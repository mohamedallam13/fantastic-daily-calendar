
//JavaScript utilizing jQuery & Bootstrap


var now
var currentHour
var formatted
const STARTING_HOUR = 9;
const FINAL_HOUR = 17;

var savedCalendar = {};

runCalendat();

function runCalendat() {
    getCurrentTime()
    saveDayInlocal();
    getSavedCalendar();
    generateCalendar();
}

function saveDayInlocal() {
    var savedTime = localStorage.getItem("calendarDate");
    if (savedTime) {
        var nowDay = now.day();
        var savedDateDay = moment(savedTime).day();
        if (nowDay - savedDateDay != 0) {
            localStorage.setItem("calendarDate", now);
            savedCalendar = {};
            localStorage.setItem("currentCalendar", JSON.stringify(savedCalendar));
        }
    } else {
        localStorage.setItem("calendarDate", now);
    }
}

function getSavedCalendar() {
    var currentLocalStorage = localStorage.getItem("currentCalendar");
    if (!(currentLocalStorage === "undefined" || currentLocalStorage === null)) {
        savedCalendar = JSON.parse(currentLocalStorage);
    }
}

function getCurrentTime() {
    now = moment();
    currentHour = now.hour();
    formatted = now.format("dddd, MMMM Do YYYY")
    var dayEl = $("#currentDay");
    dayEl.text(formatted);
}

function generateCalendar() {
    for (let hour = STARTING_HOUR; hour <= FINAL_HOUR; hour++) {
        var hour12 = getTime12(hour);
        var timeInDayClass = getTimeInDayClass(hour);
        var rowEl = $("<div>", { "class": "row" });
        addColumns(rowEl, hour, hour12, timeInDayClass);
        $("#main-calendar-body").append(rowEl);
    }
}

function addColumns(rowEl, hour, hour12, timeInDayClass) {
    var currentEntry = savedCalendar[hour] || "";
    rowEl.append([
        $("<div>", { class: "col-2 time-block", text: hour12 }),
        $("<textArea>", { class: "col-8 description " + timeInDayClass, id: hour, val: currentEntry, on: { click: editEvent } }),
        $("<div>", { class: "col-2 saveBtn", id: "button-" + hour, text: "🔒", on: { click: saveEvent } }),
    ])
}

function getTime12(hour) {
    if (hour > 12) {
        return (hour - 12) + ":00 PM";
    }
    return hour + ":00 AM";
}

function getTimeInDayClass(hour) {
    if (hour > currentHour) {
        return "future";
    } else if (hour < currentHour) {
        return "past";
    }
    return "present";
}


function editEvent(event) {
    var siblingId = event.target.nextSibling.id;
    var currentButton = $("#" + siblingId);
    currentButton.text("🔓")
}

function saveEvent(event) {
    var currentId = event.target.id;
    var siblingId = event.target.previousSibling.id;
    var currentTextArea = $("#" + siblingId);
    var currentButton = $("#" + currentId);
    currentButton.text("🔒");
    var textValues = currentTextArea.val();
    savedCalendar[siblingId] = textValues;
    localStorage.setItem("currentCalendar", JSON.stringify(savedCalendar));
    // var currentLocalStorage = localStorage.getItem("currentCalendar");
    // console.log(JSON.parse(currentLocalStorage));
}
