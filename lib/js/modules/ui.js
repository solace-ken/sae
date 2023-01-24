// ---------------------------------------------------
// ui.js --  User Interface functions 
// 
// the if (pageIsAPI()) checks are the way I separate target divs
// between the main sae index page (not API) and the API index page 
// itself located here: /sae/api/index.html (pageIsAPI())
// 
// The main index page has a target div named 'ui'
// The API index page has target div named 'display'
// TODO: come up with a better way to handle this
// ---------------------------------------------------

import { isObject } from "/sae/lib/js/modules/functions.js";
import { log } from "/sae/lib/js/modules/logger.js";

// ---------------
// PAGE ELEMENTS 
// ---------------

// images
export const logosvg = '/sae/lib/img/solace-logo.svg';		// SOLACE scalable vector graphic logo
export const errsvg = '/sae/lib/img/error.svg';				// error image (exclamation mark in triangle)
export const geargif = '/sae/lib/img/gears.gif';			// gears spinner (animated GIF)
export const blockgif = '/sae/lib/img/square-loader.gif';	// blocks spinner (animated GIF)

// target div: <div id='ui'></div>
export const ui = document.getElementById('ui');

// available templates:
export const logotpl = document.getElementById('logotpl');		// Logo
export const spintpl = document.getElementById('spintpl');		// Spinner
export const errtpl = document.getElementById('errtpl');		// Error
export const iframetpl = document.getElementById('frametpl');	// Iframe

// ------------------------------------------------------------------------------------------------------------
// TEMPLATE DISPLAY (SHOW/HIDE)
// ------------------------------------------------------------------------------------------------------------

// load HTML template (assumes data is stored inside <template> tags)
// accepts 1 argument: template id
// returns innerHTML of requested template id
export function loadTemplate(templateid) {
	if (!templateid) { console.error('There is no template id to load'); return false; }
	let tpl = document.getElementById(templateid);
	if (tpl) { return tpl.innerHTML; }
	else { console.error('Template data could not be loaded'); return false; }
}

// Logo Template
export function loadLogoTemplate() {
	if (pageIsAPI()) {
		let display = document.getElementById('display');
		if (display) { display.innerHTML = loadTemplate('logotpl'); }
	} else {
		ui.innerHTML = loadTemplate('logotpl');
		ui.style.display = 'block';
	}
}

// Spinner Template
export function loadSpinnerTemplate() {

	if (pageIsAPI()) {
		let display = document.getElementById('display');
		if (display) { display.innerHTML = loadTemplate('spintpl'); }
	} 
	else {
		ui.innerHTML = loadTemplate('spintpl');
		ui.style.display = 'block';		
	}
}

// Error Template
export function loadErrorTemplate() {
	if (pageIsAPI()) {
		let display = document.getElementById('display');
		if (display) { display.innerHTML = loadTemplate('errtpl'); }
	}
	else {
		ui.innerHTML = loadTemplate('errtpl');
		ui.style.display = 'block';	
	}
}

// Load Iframe Template
// accepts 1 argument: url to open (optional)
// if no url is given, function uses a blank page
export function loadIframeTemplate(url=null) {
	// if there is no URL, set default
	if (!url) { url = '/sae/lib/blank.html'; }	
	if (pageIsAPI()) {
		let display = document.getElementById('display');
		if (display) { display.innerHTML = loadTemplate('frametpl'); }
		// set iframe src to url
		document.getElementById('appviewer').src = url; 
	}
	else {
		// load iframe template
		ui.innerHTML = loadTemplate('frametpl');
		// set iframe src to url
		document.getElementById('appviewer').src = url; 
		// display the UI
		ui.style.display = 'block';		
	}

}

// ------------------------------------------------------------------------------------------------------------
// PAGE ELEMENT DISPLAY (SHOW/HIDE)
// ------------------------------------------------------------------------------------------------------------

// Show logo: 
// accepts 1 optional argument: sfx (special effects)
// options are: 'spin', 'spinforever', 'fadeinspin', or 'fadeoutspin'
// if no arguments are passed, a static logo will display
export function showLogo(sfx=null) {
	var mylogo = document.getElementById('logo');
	if (mylogo) {
		// if display is set to none, make visible
		if (mylogo.style.display === 'none') { mylogo.style.display = 'block'; }
		// if special effects are requested, add them...
		if (sfx === 'spin') { mylogo.classList.add('spin'); }
		if (sfx === 'fadeinspin') { mylogo.classList.add('fadeinspin'); }	
		if (sfx === 'fadeoutspin') { mylogo.classList.add('fadeoutspin'); }
		// careful with the motion on this one! This can make people dizzy
		if (sfx === 'spinforever') { mylogo.classList.add('spinforever'); } 
	} 
	// otherwise, give an error and return false
	else {
		log('There is no logo element in the requested template to show','error');
		return false;
	}
}

// Hide logo:
export function hideLogo() {
	var mylogo = document.getElementById('logo');
	// make sure we have a page element
	if (mylogo) {
		// if we do, hide the logo
		mylogo.style.display = 'none';
	} else { 
		// otherwise, give an error and return false
		log('There is no logo element in the requested template to hide','error');
		return false;
	}
}

// special case for 'fadeoutspin' CSS prevents 'flicker' effect
export function fadeOutSpinLogo() {
	var mylogo = document.getElementById('logo');
	// show fade out spin logo
	showLogo('fadeoutspin');
	// hide the logo after 1.4 seconds 
	// animation duration for fadeoutspin is 1.4 seconds
	setTimeout(function(){ hideLogo(); }, 1400);
}

// show error: requires Error Template
// accepts 1 argument: error object (title, cause, solution )
export function showError(obj) {
	if (!obj) { console.error('There is no error object to display'); return false; }
	document.getElementById('errmsg').style.display = 'block';
	document.getElementById('title').innerHTML = obj.title;
	document.getElementById('cause').innerHTML = obj.cause;
	document.getElementById('solution').innerHTML = obj.solution;	
}

// hide error: requires Error Template
export function hideError() {
	document.getElementById('errmsg').style.display = 'none';
}

// show spinner: requires Spinner Template
// accepts 1 argument: spinner object (header, image, message)
// image options are: 'gears' or 'blocks'
export function showSpinner(obj) {
	// if we have no spinner object, show an error
	if (!obj){ console.error('There is no spinner object to display'); return false; }
	// check to make sure it's an object
	if (isObject(obj)) {
		// if so, show the spinner element
		document.getElementById('spinner').style.display = 'block';
		// and set values from obj
		document.getElementById('header').innerHTML = obj.header;
		document.getElementById('message').innerHTML = obj.message;
		if (obj.image === 'gears') { showGears(); }		
		if (obj.image === 'blocks') { showBlocks(); }					
	}
}

// clear spinner: requires Spinner Template
// sets value of header and statmsg to empty
export function clearSpinner(){
	let spinzone = document.getElementById('spinner');
	if (spinzone) {
		document.getElementById('header').innerText = '';
		document.getElementById('message').innerText = '';
		return true;
	}
	else { return false; }
}

// SHOW / HIDE SPINNER ELEMENTS

// hide spinner: requires Spinner Template
export function hideSpinner() { document.getElementById('spinner').style.display = 'none'; }

// show and hide gears: requires Spinner Template
export function showGears() { document.getElementById('gears').style.display = 'block'; }
export function hideGears() { document.getElementById('gears').style.display = 'none';	}

// show and hide blocks: requires Spinner Template
export function showBlocks() { document.getElementById('blocks').style.display = 'block'; }
export function hideBlocks() { document.getElementById('blocks').style.display = 'none'; }

// show generic spinner (used by api.js)
export function showGenericSpinner() {
    // create a generic spinner object
    let gsp = {
    	"header": "Sample Heading",
        "spinner": "gears",
        "statmsg": "You can customize spinners by passing data"
    };
    // and show the spinner
    log('Showing generic spinner', 'engine');
    showSpinner(gsp); 	
}

// ------------------------------------------------------
// LOADING SEQUENCE WATERFALL:
// ------------------------------------------------------

// Screen 1
export function loadScreenOne() {
	// use the spinner template
	loadSpinnerTemplate();
	// create screen object
	const screen1 = { "header":"Checking", "image":"gears", "message":"Session Data" };
	// pass to showSpinner
	showSpinner(screen1);
	// then, after a delay...
	setTimeout(function(){ 
		clearSpinner();  // clear header and message text
		//TODO: update this function to use objects
		//checkForSaved(); // check for saved data, if not, create it
		loadScreenTwo(); // load the next screen		
	}, delay);
}	

// Screen 2
export function loadScreenTwo() {
	// create screen object
	const screen2 = { "header":"Checking", "image":"gears", "message":"Saved Data" };
	// and pass to showSpinner
	showSpinner(screen2);
	// then, after a delay...
	setTimeout(function(){ 
		hideGears();     	// hide the gears animation
		loadScreenThree(); // load the next screen 
	}, delay);	
}

// Screen 3
export function loadScreenThree() {
	// create screen object
	const screen3 = { "header":"Loading...", "image":"blocks", "message":"" };
	// and pass to showSpinner
	showSpinner(screen3);
	// then, after a delay...
	setTimeout(function(){ 
		hideSpinner(); 					 // hide the spinner 
		loadJSON(metadata, loadAppInfo); // call async function to load json data
	}, delay);		
}

// ------------------------------------------------------
// EVENT LISTENERS:
// ------------------------------------------------------

// window resize
var resizeId;
window.addEventListener('resize', function(event){
	clearTimeout(resizeId);
	// function will only be called when user stops resizing
	// (OR, if they resize the window VERY slowly)
	resizeId = setTimeout(doneResizing, 500);
});
// show dimensions in console after resize
export function doneResizing() { log('window resized','view'); }

// network status: ONLINE - green icon
window.addEventListener('online', function(e) { 
	let dot = document.getElementById('dot');
	if (dot) { 
		dot.src =  greendot; 
		dot.title = 'Status: ONLINE';
	}
	//setSaved({"online":true}); // update saved value
});

// network status: OFFLINE - red icon
window.addEventListener('offline', function(e) {
	let dot = document.getElementById('dot');
	if (dot) {
		dot.src = reddot; 
		dot.title = 'Status: OFFLINE'; 
	}
	// TODO: need to update this for new functionality
	//setSaved({"online":false}); // update saved value
});

// Add a new Javascript file to document <head> tags
// Accepts 2 arguments: full path to JS file (required) and JS script type (optional)
// example 1: addJS('/sae/lib/js/hello.js') 
// example 2: addJS('/sae/lib/js/hello.js','module') --  add optional 'type=module'
export function addJS(jsfile,jstype=null) {
	if (!jsfile) { console.log(`Function addJS() says: "there is no Javascript file to load"`); return false; }
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = jsfile;
	if (jstype) { script.type = jstype; }
	head.append(script);
  }
  
  // Add a new CSS file to document <head> tags
  // Accepts 1 argument: full path to CSS file (required)
  export function addCSS(cssfile){
	if (!cssfile) { console.log(`Function addCSS() says: "there is no CSS file to load"`); return false; }
	var head = document.getElementsByTagName('head')[0];
	var style = document.createElement('link');
	style.href = cssfile;
	style.type = 'text/css';
	style.rel = 'stylesheet';
	head.append(style);
  }
  

// -----------------------------------------------------
// DEV USE: 
// -----------------------------------------------------

export function makeLineRed() {
	document.getElementById("footer").style.borderTopColor = "red";
  }
  
  export function makeLineGray() {
	document.getElementById("footer").style.borderTopColor = appcolor;
  }

  // Turn Dev Mode On 
export function devModeOn() {
	devmode = true;
	disableback = false;
	document.title = 'Dev Mode';
	// if we're on the API page, show confirmation message
	if (pageIsAPI()) { outputData('Dev mode enabled'); display.style.borderColor = 'red'; return false; }
	// otherwise, change the ui border color to red
	else { if (ui) { ui.style.borderColor = 'red'; localStorage.setItem('devmode', true); } }
  }
  
  // Turn Dev Mode Off
  export function devModeOff() {
	devmode = false;
	disableback = true;
	document.title = 'SOLACE';
	 // if we're on the API page, show confirmation message
	if (pageIsAPI()) { outputData('Dev mode disabled'); display.style.borderColor = 'black'; return false; }
	// otherwise, change the ui border color to red  
	else { if (ui) { ui.style.borderColor = appcolor; localStorage.removeItem('devmode', false); } }
  }
  
  // Not Yet: placeholder function for links and buttons
  export function notYet() {
	  var m = 'This feature is not implemented yet';
	  alert(m);
	  console.log(m);
	  return false;
  }

  // check if we're on the home page (/index.html)
// returns: true or false
export function pageIsHome() {
	let loc = location.pathname;
	if ((loc === '/') || (loc === '/index.html')) { return true; }
	else { return false; }
  }
  
// check if we're on the API page (/api/index.html)
// returns: true or false
export function pageIsAPI()  {
	let loc = location.pathname;
	if ((loc === '/sae/api/index.html') || (loc === '/sae/api/')) { return true; }
	else { return false; }
}

// TODO: make sure this info only appears once
// log('ui.js loaded','loader');