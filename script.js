/*variable and functions declaration*/
var 
	timeSpan = document.getElementById('time'),
	interval,
	timerBig,
	timerSmall,
	timerSession,
	t,
	currentTimer,
	paused = false,
	forward = false,
	minutes = 0,
	secunds = 0,
	remember = false,
	passed = 0,
	total = 0,
	check = 0
;

function timeWriter(minutes, secunds) {
	if (secunds < 10) {
		secunds = 0 + '' + secunds;
	}
	if (minutes < 10) {
		minutes = 0 + '' + minutes;
 	}
	timeSpan.textContent = minutes + ' : ' + secunds;
}

function currentWriter() {
	var current = document.getElementById('current');
	var message;
	switch (currentTimer) {
		case 'timerSession':
			message = 'Session';
			break;
		case 'timerBig':
			message = 'Big Break';
			break;
		case 'timerSmall':
			message = 'Small Break';
			break;
		default: 
			message = '';
		}
	current.textContent = message;
}

function clock(timer) {
	currentWriter();
	var timeOut = Date.now() + timer*60000;
	interval = setInterval (function (){
		t = timeOut - Date.now();
		secunds= Math.floor((t/1000)%60);
		minutes= Math.floor((t/1000/60)%60);
		if (timeOut <= Date.now()) {
			clearInterval(interval);
			session(check);
		}
		if (secunds >= 0 && minutes >= 0) {
			timeWriter(minutes, secunds);
		}
	}, 1000);
}

function session (check_arg) {
	switch (check_arg) {
		case 0: 
				currentTimer = 'timerSession';				
				clock (timerSession);
				passed++;
				total++;
				if (passed < 4) {
					check = 1;
				} else if (passed == 4) {
					check = 2;
				}
				break;
		case 1: 
				currentTimer = 'timerSmall';				
				clock (timerSmall);
				display_tomatoes();
				check = 0;
				break;
		case 2: 
				currentTimer = 'timerBig';
				clock(timerBig);
				passed = 0;
				display_tomatoes();
				check = 0;
				break;
	}
}

function display_tomatoes() {
	document.getElementById('passed').textContent = passed;
	document.getElementById('total').textContent = total;
}

function setDeleteCookies(condition) {
	var namesValues = [
			['timerBig', timerBig],
			['timerSmall', timerSmall],
			['timerSession', timerSession],
			['passed', passed],
			['total', total],
			['check', check],
			['minutes', minutes],
			['secunds', secunds],
			['t', t],
			['currentTimer', currentTimer],
			['remember', remember]
		];
	var date = new Date();
	if(condition) {
		date.setDate(date.getDate() + 30);
	} else {
		date.setDate(date.getDate() -1);
	} 
	var cookie_part = '; path=/; expires=' + date.toUTCString();
	for (var i=0; i<namesValues.length; i++) {
		var arrayElement = namesValues[i];
		document.cookie = arrayElement[0] + '=' + arrayElement[1] + cookie_part;
	}
}

function getCookie() {
	if (document.cookie) {
		paused = true;
		var cookie = document.cookie;
		var arr = cookie.split('; ');
		var obj = {};
		for (var i = 0; i < arr.length; i++) {
				var index = arr[i].indexOf('=');
				var name = arr[i].substring(0, index);
				var value = arr[i].substring(index+1);
				obj[name] = value;
			}
		timerBig = +obj.timerBig;
		timerSmall = +obj.timerSmall;
		timerSession = +obj.timerSession;
		passed = +obj.passed;
		total = +obj.total;
		check = +obj.check;
		minutes = +obj.minutes;
		secunds = +obj.secunds;
		t = +obj.t;
		currentTimer = obj.currentTimer;
		remember = obj.remember;
		console.log(currentTimer);
	}
}

//work wirth form
var form = document.querySelector("form");
function grabUserSettings() {
	timerSession = form.elements.timerSession.value;
	timerBig = form.elements.timerBig.value;
	timerSmall = form.elements.timerSmall.value;
}

//display values when page is loaded
function afterLoad () {
	getCookie();
	if (remember) {
		form.elements.remember.checked = 'checked';
	}
	display_tomatoes();
	timeWriter(minutes, secunds);
	currentWriter();
	console.log(currentTimer);
}
/*end variable and functions declaration*/


//display values when page is loaded
afterLoad ();

/*add behaviour for buttons*/
//play button
var play = document.getElementById('play');
play.addEventListener('click', function(event) {
	event.preventDefault();
	if ((typeof(currentTimer) == 'undefined') || (currentTimer == '')) {
		grabUserSettings();
		currentTimer = 'timerSession';
		session(check);
	} else if (form.elements.timerSession.value == timerSession &&
		form.elements.timerBig.value == timerBig &&
		form.elements.timerSmall.value == timerSmall) {
			if (paused) {
				clock(t/60000);
				paused = false;
			} else {
				return false;	
			}
	} else {
		switch (currentTimer) {
			case 'timerSession':
				if (form.elements.timerSession.value !== timerSession) {
					clearInterval(interval);
					grabUserSettings();
					clock(timerSession);
				}
				break;
			case 'timerBig':
				if (form.elements.timerBig.value !== timerBig) {
					clearInterval(interval);
					grabUserSettings();
					clock(timerBig);
				}
				break;
				case 'timerSmall':
				if (form.elements.timerSmall.value !== timerSmall) {
					clearInterval(interval);
					grabUserSettings();
					clock(timerSmall);
				}
				break;
		}
		paused = false;
	}
});

//reset button (delete cookie, reset variables)
var resetButton = document.getElementById('reset');
resetButton.addEventListener('click', function(event) {
	event.preventDefault();
	setDeleteCookies(false);
	passed = 0;
	total = 0;
	check = 0;
	minutes = 0;
	secunds = 0;
	t=0;
	currentTimer = '';
	form.elements.timerSession.value = 20;
	form.elements.timerBig.value = 15;
	form.elements.timerSmall.value = 3;
	form.elements.remember.checked = false;

	clearInterval(interval);
	display_tomatoes();
	timeWriter(minutes, secunds);
	currentWriter();
});

//pause button
var pause = document.getElementById('pause');
pause.addEventListener('click', function(event) {
	event.preventDefault();
	clearInterval(interval);
	paused = true;
});



//step forward button
var stepForward = document.getElementById('stepForward');
stepForward.addEventListener('click', function(event) {
	event.preventDefault();
	clearInterval(interval);
	session(check);
});

//save cookie before leaving a page (if user wants to save progress)
window.onbeforeunload = function () {
	remember = form.elements.remember.checked;
	if(remember) {
		setDeleteCookies(true);
		paused = true;
	}
}

