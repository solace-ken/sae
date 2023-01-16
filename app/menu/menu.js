// ------------------------------------------------------	
// menu.js - SOLACE MENU 
//
// Default app which loads in SAE (var 'dapp' in sae.js)
//
// There is no EXIT button for this app.
//
// SOLACE App Engine is either showing this app, or it's
// showing a 3rd party app. There is nothing else.
//
// Menu can be controlled via API
// ------------------------------------------------------

// version
const menuver = '1.0.6 alpha';

// SOLACE Menu routemap 
const menumap = '/lib/routemap.json';					

// page elements
const container = document.getElementById('container');
const viewer = document.getElementById('viewer');
const footer = document.getElementById('footer');

// images
const reddot = '/lib/img/circle-red-filled.svg';		// red status icon
const yellowdot = '/lib/img/circle-yellow-filled.svg';	// yellow status icon (not currently used)
const greendot = '/lib/img/circle-green-filled.svg';	// green status icon
const bluedot = '/lib/img/circle-blue-filled.svg';		// blue status icon (not currently used)
const blacklogo = '/lib/img/solace-logo-round.svg';		// black round SOLACE logo
const bluelogo = '/lib/img/solace-logo-round-blue.svg';	// blue round SOLACE logo

// load the SOLACE Menu
showSolaceMenu();

// Show SOLACE Menu 
function showSolaceMenu() {

	// load the viewer template
	viewer.innerHTML = loadTemplate('solace_menu');

	// load the footer template
	footer.innerHTML = loadTemplate('default_buttons');

	// statusbar elements
	const smlogo = document.getElementById('solacemenu');	// small, round SOLACE logo (left side)
	const dot = document.getElementById('dot');				// small, network status dot (right side)
	
	// set SOLACE Menu icon
	smlogo.src = blacklogo;

	// if online, show green icon
	if (navigator.onLine) { 
		dot.src = greendot; 
		dot.title = 'STATUS: ONLINE';
		//setSaved({"online":true});
	}
	// update DOM: show target div
	container.style.display = 'block';
}

// change logo blue on hover
function changeLogo() { logo.src = bluelogo; }

// reset logo to black on unhover
function resetLogo() { logo.src = blacklogo; }

// change blue, spin, and change back to black
// a visual indicator to let user know menu is there
function animateLogo() {
	logo.src = bluelogo;
	logo.style.animationName = 'spinbtn';
	logo.style.animationDuration = '1s';	
}

// Animate SOLACE Menu icon after 4 seconds
function logoSpin() { setTimeout(function(){animateLogo(); return true;}, 4000); }

// Start the SOLACE Menu:
// DEV NOTE: Need to move some of this stuff to SAE...
//
/* function startSolaceMenu() {
	// check session (sends user to '/' if they don't have one)
	checkSession();
	// returning user: we have a 'firstrun' flag
	if (getSaved('firstrun')) {
		// check to see if we have Current App value
		if ((capp) && (capp !=dapp)) {
			// if it's not default app, load the current app
			location.href = (capp);
		}	
		// if there is no current app value, load SOLACE Menu
		else {
			// logging
			log('Welcome back!','solace');	
			// actually load the SOLACE Menu
			//loadSolaceMenu();
		}
	}
	// No 'firstrun' flag? do firstRun()
	else { firstRun(); }
} */

// First Run
// runs one time during initial startup 
// sets a flag named 'firstrun' to true
/* function firstRun() {
	// logging
	log('initializing app','engine');
	// check for SAE key...
	if (getMetaData()) {
		// user has meta-data, but no saved key
		// re-create storage key
		createSaved();
		// reset 'firstrun' flag
		setSaved({"firstrun":true});
		// load the SOLACE Menu
		loadSolaceMenu();	
	}
	// no SAE key?
	// kick off status message waterfall (ui.js)
	// this eventually sets localStorage values
	else { loadScreenOne(); }
}

// Load meta-data from JSON file
async function loadAppInfo(fname){	
	log('loading SAE data...','engine');
	// wait for it...
	let data = await getJSONPromise(fname);
	// create new App Engine key (storage.js)
	createMetaData(data);
	// create app data storage key (storage.js)
	createSaved();
	// set 'firstrun' flag (storage.js)
	setSaved({"firstrun":true});
	// load the SOLACE Menu
	//loadSolaceMenu();
	// Logging 
	if (data) { log('SAE data loaded successfully','engine'); }
} */

// show network status
// TODO: get colors right (same as dot icons)
// TODO: add event listener or localstorage check for status
function showNetStatus() {
	// target div
	let ns = document.getElementById('netstatus');
	// online status (from browser)
	let isOnline = navigator.onLine;
	// check to see if user is online
	if (isOnline) {
		// if yes, show the ONLINE message
		ns.innerHTML = `<div class="networkstatus online" title="Status: ONLINE">ONLINE</div>`;
	} else {
		// if no, show the OFFLINE message
		ns.innerHTML = `<div class="networkstatus offline" title="Status: OFFLINE">OFFLINE</div>`;					
	}	
}

log('menu.js loaded', 'loader');
log('Menu version: ' + menuver, 'solace');