/**
 * @fileoverview This file updates the current time in reference to the schedule
 * that the current day is running. This file only applies to the home page of
 * each school, otherwise known as the main, timer page.
 * @version January 3rd, 2023
 * @authors Logan Cover, Skylar Smith, Gabriel Iskandar
 **/

var updateClockFrame = 0; //used for animation frame tracking

var secOffset = -1; //seconds offset (always set to -1)
var minOffset = 0; //minute offset (testing variable)
var hourOffset = 0; //hour offset (testing variable)
var enableOffset = false;

var now = newDateAdjusted(); //user's current time
var curTotalSec = 0; //user's current time in seconds
const pageLoadDate = now.toISOString().split('T')[0]; //date the user loaded the page
const schedname = (JSON_calendar[now.getFullYear()] === undefined) ? "000" :
	JSON_calendar[now.getFullYear()][now.getMonth()][now.getDate() - 1]; //name of the day's schedule
const schedule = (JSON_sched[schedname] === undefined) ? JSON_sched["000"] : JSON_sched[schedname]; //schedule the timer follows

var index_obj = { //index object to track main schedule and sub schedule positions
	main_index: -1
}

/**
 * corrects the current time based on the offset (testing) variables
 * @returns a new Date object given the offsets
 **/
function newDateAdjusted() {
	return new Date(
		Date.now() // user's clock
		+ (1000 * secOffset) + (60000 * minOffset) + (3600000 * hourOffset) // because it's easier to do this than fix the off-by-one error
	);
}

/**
 * updates the timing system used
 * @returns boolean if the day was not reloaded (not relevant value)
 */
function updateClock() {
	now = newDateAdjusted();
	curTotalSec = (now.getHours() * 60 * 60) + now.getMinutes() * 60 + now.getSeconds();
	if (pageLoadDate != now.toISOString().split('T')[0]) {
		// new day
		window.location.reload(true);
		return false;
	}
	return true;
}

//main loop
function tick() {
	if (updateClock()) {
		updateDisplay();
		window.cancelAnimationFrame(updateClockFrame);
		updateClockFrame = window.requestAnimationFrame(tick);
	} else {
		window.cancelAnimationFrame(updateClockFrame);
	}
}

/**
 * initializes the schedule and timing system
 */
function init() {
	updateClock();
	let i = 0;
	for (let period of schedule.periods) {
		if (!isEmpty(period.intraschedule)) {
			index_obj[i] = 0;
		}
		if (getTimeRemaining(period) < 0) {
			index_obj.main_index = i + 1;
		}
		periodBox.children[2].appendChild(createElement('button', ["class", "gallery-dot"]));
		i++;
	}
	//paint screen
	if (index_obj.main_index == -1 || index_obj.main_index == schedule.periods.length) {
		updateTimer(0, true, null);
		updateScheduleDisplay(true);
	} else {
		updateScheduleDisplay(false);
		updateTimer(getTimeRemaining(), false, schedule.periods[index_obj.main_index]);
		periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot active";
		if (!isEmpty(schedule.periods[index_obj.main_index].intraschedule)) {
			displaySubPeriodOptions(schedule.periods[index_obj.main_index]);
		}
	}
	//start loop
	tick();
}

/**
 * updates the countdown and progress bar
 * @param {Integer} timeRemaining time remaining until the endTime
 * @param {boolean} displayBlank if the current schedule is not active
 * @param {Object} period period object (should be current active)
 */
function updateTimer(timeRemaining, displayBlank, period) {
	if (displayBlank || timeRemaining < 0) {
		countdown.children[0].textContent = "--:--";
		countdown.children[1].children[0].style.width = "0%";
	} else {
		//calculate display time
		let progress;
		if (curTotalSec < period.startTime) {
			progress = "0%";
			timeRemaining -= (period.endTime - period.startTime);
		} else {
			progress = (1 - (timeRemaining / (period.endTime - period.startTime))) * 100 + "%";
		}
		let timeArr = [];
		do {
			timeArr.unshift(timeRemaining % 60);
			timeRemaining = (timeRemaining / 60) >> 0; //integer division
		} while (timeRemaining != 0);

		countdown.children[0].textContent = timeArr.map(t => (t < 10) ? `0${t}` : t).join(":");
		countdown.children[1].children[0].style.width = progress;
	}
}

/**
 * updates the schedule name and time
 * @param {boolean} displayBlank if the current schedule is not active
 */
function updateScheduleDisplay(displayBlank) {
	if (displayBlank) {
		periodBox.children[0].textContent = "";
		periodBox.children[1].textContent = "Not School Hours";
	} else {
		let period = schedule.periods[index_obj.main_index];
		if (period.intraindex != -1) {
			period = period.intraschedule[period.intraindex][index_obj[index_obj.main_index]];
		}
		periodBox.children[0].textContent = period.name;
		periodBox.children[1].textContent = to12HTime(period.startTimeDigits) + " - " + to12HTime(period.endTimeDigits);
	}
}

/**
 * Displays information on the current active period
 */
function updateDisplay() {
	let period = schedule.periods[index_obj.main_index];
	if (period == undefined) {
		return;
	}
	let timeRemaining = getTimeRemaining();
	if (timeRemaining == 0) { //update to next period
		periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot";
		if (period.intraindex != -1 &&
			(index_obj[index_obj.main_index] !=
				(period.intraschedule[period.intraindex].length - 1))) {
			//If within a sub period and we don't advance to the next main period
			index_obj[index_obj.main_index] += 1;
		} else { //advancing the next main period
			index_obj.main_index += 1;
		}
		if (index_obj.main_index < schedule.periods.length) {
			periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot active";
		}
		updateScheduleDisplay((index_obj.main_index == schedule.periods.length || index_obj.main_index == -1));
		displaySubPeriodOptions(schedule.periods[index_obj.main_index]);
	}
	if (period.intraindex != -1) {
		period = period.intraschedule[period.intraindex][index_obj[index_obj.main_index]];
	}
	updateTimer(timeRemaining, (index_obj.main_index == schedule.periods.length || index_obj.main_index == -1), period);
}

/**
 * Displays options to use a sub period schedule
 * @param {Object} period period object
 */
function displaySubPeriodOptions(period) {
	if (period == undefined) {
		replaceAllChildren(subBox, []);
		return;
	}
	let buttons = [];
	let i = 0;
	for (let sub in period.intraschedule) {
		buttons.push(createElement("button", ["class", "container hover"], ["text", sub]));
		if (sub == period.intraindex) {
			buttons[i].classList = "container hover active";
		}
		buttons[i].onclick = function () {
			if (period.intraindex == sub) {
				period.intraindex = -1;
				this.classList = "container hover";
				updateScheduleDisplay(false);
				return;
			}
			period.intraindex = sub;
			for (let child of subBox.children) {
				if (child != this)
					child.classList = "container hover";
			}
			index_obj[index_obj.main_index] = 0;
			let j = 0;
			while (j < period.intraschedule[sub].length - 1 &&
			(period.intraschedule[sub][j].endTime - curTotalSec < 0)) {
				index_obj[index_obj.main_index] = j + 1;
				j++;
			}
			this.classList = "container hover active";
			updateScheduleDisplay(false);
		}
		i++;
	}
	replaceAllChildren(subBox, buttons);
}

/**
 * Calculates the amount of seconds left between the current time and the end of the period
 * @param {Object} period period object
 * @returns Integer distance between the times
 */
function getTimeRemaining(period = null) {
	if (period != null) { //if provided an argument
		return period.endTime - curTotalSec;
	} else { //use current period
		let period = schedule.periods[index_obj.main_index];
		if (period === undefined) {
			return -1;
		}
		if (schedule.periods[index_obj.main_index].intraindex != -1) {
			return (period.intraschedule[period.intraindex][index_obj[index_obj.main_index]].endTime - curTotalSec);
		} else {
			return period.endTime - curTotalSec;
		}
	}
}

/**
 * Advances the periods in the direction provided
 * @param {Integer} direction -1 or 1
 */
function arrowAdvancePeriod(direction) {
	let skip = false;
	if (direction > 0) {
		if (index_obj.main_index >= schedule.periods.length - 1) {
			return;
		}
		if (index_obj.main_index == -1) {
			index_obj.main_index = 0;
			skip = true;
		}
	} else if (direction < 0) {
		if (index_obj.main_index <= 0) {
			return;
		}
		if (index_obj.main_index == schedule.periods.length) {
			index_obj.main_index = schedule.periods.length - 1;
			skip = true;
		}
	}
	let period = schedule.periods[index_obj.main_index];
	periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot";
	if (!skip) {
		if (period.intraindex !== -1 &&
			(index_obj[index_obj.main_index] + direction < period.intraschedule[period.intraindex].length) &&
			(index_obj[index_obj.main_index] + direction >= 0)) {
			//If within a sub period and we don't advance to the next main period
			index_obj[index_obj.main_index] += direction;
			period = period.intraschedule[period.intraindex][index_obj[index_obj.main_index]];
		} else { //advancing the next main period
			index_obj.main_index += direction;
		}
	}
	periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot active";
	updateScheduleDisplay((index_obj.main_index == schedule.periods.length || index_obj.main_index == -1));
	updateTimer(getTimeRemaining(), (index_obj.main_index == schedule.periods.length || index_obj.main_index == -1), period);
	displaySubPeriodOptions(schedule.periods[index_obj.main_index]);
}

/**
 * Check if a given object has no properties
 * @param {Object} object
 * @returns boolean true if the object has no properties
 */
function isEmpty(object) {
	for (let i in object) {
		return false;
	}
	return true;
}

/**
 * Converts 24 hour to 12 hour time
 * @param {String} time time in HH:MM form
 * @returns String time in HH:MM form
 */
function to12HTime(time) {
	time = time.split(":");
	let digit = parseInt(time[0]);
	time[0] = (digit > 12) ? padDigit(digit % 12) : padDigit(digit);
	return time.join(":");
}

function padDigit(number) {
	if (number < 10) {
		return `0${number}`
	} else {
		return number;
	}
}
