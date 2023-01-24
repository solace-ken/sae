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
const menuver = '1.0.9 alpha';

// SOLACE Menu routemap 
const menumap = '/sae/app/menu/routemap.json';					

// page elements
const container = document.getElementById('container');
const viewer = document.getElementById('viewer');
const footer = document.getElementById('footer');

// images
const reddot = '/sae/lib/img/circle-red-filled.svg';			// red status icon
const yellowdot = '/sae/lib/img/circle-yellow-filled.svg';		// yellow status icon (not currently used)
const greendot = '/sae/lib/img/circle-green-filled.svg';		// green status icon
const bluedot = '/sae/lib/img/circle-blue-filled.svg';			// blue status icon (not currently used)
const blacklogo = '/sae/lib/img/solace-logo-round.svg';		// black round SOLACE logo
const bluelogo = '/sae/lib/img/solace-logo-round-blue.svg';	// blue round SOLACE logo

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
	// start the router (with routemap)
	startRouter(menumap);

	if (localStorage.getItem('devmode')) {
		makeLineRed();
	}
	else {
		makeLineGray();
	}
	

	// update DOM: show the target div
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
function logoSpin() { setTimeout(function(){ animateLogo(); return true; }, 4000); }

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

// Make sure this info only loads once during start
// log('menu.js loaded', 'loader');
log('Menu version: ' + menuver, 'solace');