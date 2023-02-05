// ---------------------------------------------------
// ui.js --  User Interface functions 
// 
// DEV NOTE:
//
// The "pageIsAPI" checks are my way of separating target divs
// between the main SAE page: /sae/index.html [pageIsAPI() = false]
// and the API page: /sae/api/index.html [pageIsAPI() = true]
// 
// Main index page has target div named 'ui'
// API index page has target div named 'display'
//
// TODO: need to come up with a better way to handle this
// TODO: most obvious solution is to rename API div to 'ui'
// ---------------------------------------------------

import {appcolor } from "/sae/lib/js/modules/variables.js";
import { log } from "/sae/lib/js/modules/logger.js";
//import { outputData } from "/sae/lib/js/modules/api.js";
import { isObject, isEmpty, isPositiveInteger } from "/sae/lib/js/modules/functions.js";
import { checkDevmode } from "/sae/lib/js/modules/storage.js";
import { logotpl, spintpl, errtpl, iframetpl } from "/sae/lib/js/modules/templates.js";

// ---------------
// PAGE ELEMENTS 
// ---------------

// target div
export const ui = document.getElementById('ui');

// images
export const logosvg = '/sae/lib/img/solace-logo.svg';		// SOLACE scalable vector graphic logo
export const errsvg = '/sae/lib/img/error.svg';				// error image (exclamation mark in triangle)
export const geargif = '/sae/lib/img/gears.gif';			// gears spinner (animated GIF)
export const blockgif = '/sae/lib/img/square-loader.gif';	// blocks spinner (animated GIF)

// DEV USE: if we have no data-routetype in target div, it defaults to 'internal'
//
// Method for users to indicate whether templates are 
// internal (using a .js file) or external (using <template> tags):
//
// Internal templates: <div id="ui" data-routetype="internal"></div>
// External templates: <div id="ui" data-routetype="external"></div>
//

// make sure we have ui first...
if (ui) {
	var routetype = ui.dataset.routetype;
	if (!routetype) { routetype = 'internal'; }
}	

// ------------------------------------------------------------------------------------------------------------
// TEMPLATE DISPLAY (SHOW/HIDE)
// ------------------------------------------------------------------------------------------------------------

// LOAD EXTERNAL TEMPLATE
// accepts 1 argument: template id
// returns innerHTML of requested template id
export function loadExternalTemplate(tid) {
	if (!tid) { console.error('There is no template id to load'); return false; }
	let tpl = document.getElementById(tid);
	if (tpl) { return tpl.innerHTML; }
	else { console.error('Template data could not be loaded'); return false; }
}

// LOAD INTERNAL TEMPLATE
// accepts 1 argument: template name 
// returns HTML for requested template
export function loadInternalTemplate(name) {
	if (!name) { console.error('No template was requested'); return false; }
	// figure out the correct template
	// valid options are: logo, spinner, error, iframe
	if (name === 'logotpl') { return logotpl; }
	if (name === 'spintpl') { return spintpl; }	
	if (name === 'errtpl') { return errtpl; }
	if (name === 'iframetpl') { return iframetpl; }
	// if they made it here, show an error
	console.error('Template data could not be loaded'); 
	return false; 
}

// Logo Template
export function loadLogoTemplate() {
	if (ui) {
		ui.innerHTML = loadInternalTemplate('logotpl');
		ui.style.display = 'block';	
	}
	else { return false; }
}

// Spinner Template
export function loadSpinnerTemplate() {
	if (ui) {	
		ui.innerHTML = loadInternalTemplate('spintpl');
		ui.style.display = 'block';	
	}
	else { return false; }
}

// Error Template
export function loadErrorTemplate() {
	if (ui) {
		ui.innerHTML = loadInternalTemplate('errtpl');
		ui.style.display = 'block';	
	}
	else { return false; }
}

// Load Iframe Template
// accepts 1 argument: url to open (optional)
// if no url is given, function uses a blank page
export function loadIframeTemplate(url=null) {
	// if there is no URL, set a default page
	if (!url) { url = '/sae/lib/blank.html'; }	
	if (ui) {
		ui.innerHTML = loadInternalTemplate('iframetpl');
		// set iframe src to url
		document.getElementById('appviewer').src = url; 
		// display the UI
		ui.style.display = 'block';	
	}
	else { return false; }	
}

// ------------------------------------------------------------------------------------------------------------
// SHOW / HIDE PAGE ELEMENTS
// ------------------------------------------------------------------------------------------------------------

// Show logo: 
// accepts 1 optional argument: sfx (special effects)
// options are: 'spin', 'spinforever', 'fadeinspin', or 'fadeoutspin'
// if no arguments are passed, a static logo will display
export function showLogo(sfx=null) {
	// make sure we have a ui element first...
	if (ui) {
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
}

// Hide logo:
export function hideLogo() {
	// make sure we have a ui element first...
	if (ui) {
		var mylogo = document.getElementById('logo');
		// make sure we have a page element
		if (mylogo) {
			// if we do, hide the logo
			mylogo.style.display = 'none';
		} 
		// otherwise, return false
		else { return false; }
	}	
}

// special case for 'fadeoutspin' CSS prevents 'flicker' effect
export function fadeOutSpinLogo() {
	// make sure we have a ui element first...
	if (ui) {
		var mylogo = document.getElementById('logo');
		// show fade out spin logo
		showLogo('fadeoutspin');
		// hide the logo after 1.4 seconds 
		// animation duration for fadeoutspin is 1.4 seconds
		setTimeout(function(){ hideLogo(); }, 1400);
	}
}

// show error: requires Error Template
// accepts 1 argument: error object (title, cause, solution )
export function showError(obj) {
	// make sure we have a ui element first...
	if (ui) {
		if (!obj) { console.error('There is no error object to display'); return false; }
		document.getElementById('errmsg').style.display = 'block';
		document.getElementById('title').innerHTML = obj.title;
		document.getElementById('cause').innerHTML = obj.cause;
		document.getElementById('solution').innerHTML = obj.solution;	
	}	
}

// hide error: requires Error Template
export function hideError() {
	// try to get the div
	let errdiv = document.getElementById('errmsg');
	// if we have both an error div and ui element...
	if ((errdiv) && (ui)) {
		// hide the element
		errdiv.style.display = 'none';
	}
}

// show spinner: requires Spinner Template
// accepts 1 argument: spinner object (head, img, msg)
// image options are: 'gears' or 'blocks'
// returns true or false
export function showSpinner(obj) {

	console.log('SPO obj received!', obj);

	// make sure we have a ui element
	if (ui) {
		// if we have no spinner object, show an error
		if (!obj){ log('There is no spinner object to display','error'); return false; }
		// check to make sure it's really an object
		if (isObject(obj)) {
			// and that it's not empty
			if (isEmpty(obj)) { log('The spinner object you passed is empty','error'); return false; }
			//
			// WE HAVE A VALID SPINNER OBJECT
			//
			// try to grab the spinner element
			let spindiv = document.getElementById('spinner');
			// if we have a spinner div,
			if (spindiv) {	

				// show the spinner element
				spindiv.style.display = 'block';
				// if we have a width value,
				if (obj.width) {
					// and, if it's a positive integer,
					if (isPositiveInteger(obj.width)) {
						// that's between 351 and 1000
						if ((obj.width > 350) && (obj.width < 1001)) {
							// set the spinner width to the new value
							spindiv.style.width = `${obj.width}px`;
						}
					}
				}

				// if we have a height value
				if (obj.height) {
					// and, if it's a positive integer,
					if (isPositiveInteger(obj.height)) {
						// that's between 180 and 400
						if ((obj.height > 180) && (obj.height < 401)) {
							// set the spinner width to the new value
							spindiv.style.height = `${obj.height}px`;
						}
					}				
				}
				
				// set remaining string values from obj
				document.getElementById('head').innerHTML = obj.head;
				document.getElementById('msg').innerHTML = obj.msg;

				// and, decide which image to display
				if (obj.img === 'gears') { showGears(); }		
				if (obj.img === 'blocks') { showBlocks(); }	

				return true;
			}	
			// there is no spin div
			// else {}
		}
		// not really an object
		// else {}
	}
	// no ui element
	else { return false; }
}

// SHOW / HIDE SPINNER ELEMENTS

// hide the spinner div:
export function hideSpinner() { 
	// make sure we have a ui element first...
	if (ui) {
		// hide all animated gifs
		hideAllGifs();
		// hide the entire spinner div
		document.getElementById('spinner').style.display = 'none'; 
	}	
}

// hide all animated GIFs
// TODO: as we add new spinner graphics, we have to update this function!
export function hideAllGifs() {
	hideGears();	// hide the gears
	hideBlocks();	// hide the blocks
}

// show / hide gears: 
export function showGears() { 
	// make sure we have a ui element first...
	if (ui) {
		document.getElementById('gears').style.display = 'block'; 
	}	
}
export function hideGears() { 
	// make sure we have a ui element first...
	if (ui) {
		document.getElementById('gears').style.display = 'none';
	}		
}

// show / hide blocks:
export function showBlocks() { 
	// make sure we have a ui element first...
	if (ui) {
		document.getElementById('blocks').style.display = 'block';
	}	 
}
export function hideBlocks() { 
	// make sure we have a ui element first...
	if (ui) {
		document.getElementById('blocks').style.display = 'none'; 
	}	
}

// ------------------------------------------------------
// EVENT LISTENERS:
// TODO: document these and add event listeners for button clicks
// ------------------------------------------------------

// window resize
var resizeId;
window.addEventListener('resize', function(event){
	clearTimeout(resizeId);
	// function will only be called when user stops resizing
	// (OR, if they resize the window VERY slowly)
	resizeId = setTimeout(doneResizing, 500);
});
// show screen dimensions after window resize
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

// ------------------------------------------------------
// ADD CSS / JAVASCRIPT FILES TO DOCUMENT HEAD:
// ------------------------------------------------------

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

// Dev Mode = ON
export function devModeOn() {
	// make sure we really have a 'devmode' flag...
	if (checkDevmode()) { 	
		// give console confirmation
		log('Dev Mode ON~~crimson','custom');
		// update window title
		document.title = 'SOLACE - Dev Mode';			
		// change 'ui' border color to red
		if (ui) {
			ui.style.borderColor = 'red';
			ui.style.display = 'block';
		}
	}
}
  
// Dev Mode = OFF
export function devModeOff() {
	// make sure the 'devmode' flag is gone
	if (!checkDevmode()) { 	
		// give console confirmation
		log('Dev Mode OFF~~crimson','custom');
		// update window title
		document.title = 'SOLACE';	
		// change 'ui' border color to default
		if (ui) {
			ui.style.borderColor = appcolor;
			ui.style.display = 'block';
		}
	}
}

// -----------------------------------------------------
// DEV USE: testing & non-functional stuff
// -----------------------------------------------------

// testing: trigger a function on image load
// create an image and add: onload="testFun()"
//
/* function testFun() {
	var foo = 325 + 105;
	var msg = `This message was triggered by an image.`;
	log(msg,'dev');
	log(`This is an interpolated value: ${foo}`,'dev');
} */