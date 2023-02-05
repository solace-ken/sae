// ------------------------------------------------------------------------------------------------------------
// main.js - SOLACE App Engine (SAE): 
//
// A system for managing self-contained Javascript apps with a set of common libaries and centralized menu
/* 
   _____                      ______     
  / ____|         /\         |  ____|    
 | (___          /  \        | |__       
  \___ \        / /\ \       |  __|      
  ____) |  _   / ____ \   _  | |____   _ 
 |_____/  (_) /_/    \_\ (_) |______| (_)
                                                                                                                                                                                                                                                        
*/
// ------------------------------------------------------------------------------------------------------------
//
// checks for device storage
// sets a SOLACE session with timestamp and token
// manages storage and sessions
// monitors online/offline status
// provides api access to gui elements for other scripts
// manages loading / unloading of 3rd party apps
// handles version control and updates
// 
// created in 2022 by Ken Dawson <ken@solace.network>
//
// last updated: 02/04/23
// ------------------------------------------------------------------------------------------------------------

// VARIABLES
import { 
	metadata, 
	delay 
} from "/sae/lib/js/modules/variables.js";

import { 
	tstamp, 
	getRandNum, 
	isEmpty,
	getJSONPromise,
	notYet
} from "/sae/lib/js/modules/functions.js";

import { 
	log
} from "/sae/lib/js/modules/logger.js";

import { 
	loadLogoTemplate,
	loadSpinnerTemplate,
	loadErrorTemplate, 
	loadIframeTemplate, 
	showLogo, 
	hideLogo, 
	showError,
	fadeOutSpinLogo,
	showSpinner,
	hideSpinner,
	showGears,
	hideGears,
	showBlocks,
	hideBlocks
} from "/sae/lib/js/modules/ui.js";

import { 
	checkSession, 
	createSolaceSession,
	getStartTime
} from "/sae/lib/js/modules/session.js";

import { 
	checkForStorage,
	saveDeviceInfo,
	getSaved,
	setSaved,
	getSaeMetaData,
	createSaeMetaData,
	initializeStorage,
	saveTargDiv
} from "/sae/lib/js/modules/storage.js";

import { 
	params,
	processResults
} from "/sae/lib/js/modules/api.js";

// test if storage is available
if (checkForStorage()) {

	// check for URL parameters:
	// if 'params' is empty, we have no API requests 
	if (isEmpty(params)) {
		// TODO: fix bug where you see blank screen if SAE metadata missing
		// if we have a location hash, save to infokey
		if (location.hash) { setSaved({"type":"info","hash":location.hash}); }
		// check if boot message flag is true
		let bootmsg = getSaved({"key":"bootmsg"});
		// if so, they've already seen boot messages,
		if (bootmsg) {
			// check if we have a showmenu flag
			let showmenu = getSaved({"key":"showmenu"});
			// if showmenu flag is 'true', load the SOLACE Menu
			if (showmenu) { loadIframeTemplate('/sae/app/menu/'); }
			// TODO: add checks for current and last app
		}
		// boot message flag is false, do first run
		else {	
			loadLogoTemplate();
			showLogo('spin');
			checkSession();
			// wait 1.5 seconds, hide the logo, and start the waterfall...
			setTimeout(function(){ hideLogo(); loadScreenOne(); }, 1500);
		}
		// show temporary messages passed via datakey => msg
		showTempMsg();
	}
	// we have an API request: (handled by module api.js)
	// else {}
}
// no device storage: show error
else { 	
	// new error object
	let error = { 
		"title":"No Device Storage Available", 
		"cause":"This application can't access the hard drive (or memory) of your device", 
		"solution":"This error can be caused by having cookies disabled. To use the app, you must have cookies enabled. Check your device storage and/or browser settings and try reloading the site again." 
	};
	loadErrorTemplate();
	showError(error);
}

// ------------------------------------------------------
// WATERFALL: shows 3 spinners in a row with timeouts
// loads and saves data during initial boot up
// ------------------------------------------------------

// Screen 1
function loadScreenOne() {
	// load spinner template
	loadSpinnerTemplate();
	// create a screen object
	const screen1 = { "head":"Checking", "img":"gears", "msg":"System Requirements" };
	// pass to showSpinner
	showSpinner(screen1);
	// then, after a delay...
	setTimeout(function() { 
		hideSpinner();  		// hide the spinner
		initializeStorage();	// initialize storage keys
		saveDeviceInfo();		// save device info to infokey
		loadScreenTwo(); 		// load the next screen		
	}, delay);
}	

// Screen 2
function loadScreenTwo() {
	// use the spinner template
	loadSpinnerTemplate();	
	// create screen object
	const screen2 = { "head":"Checking", "img":"gears", "msg":"Saved Data" };
	// and pass to showSpinner
	showSpinner(screen2);
	// then, after a delay...
	setTimeout(function() { 
		hideSpinner();     				// hide the spinner
		loadScreenThree(); 				// load the next screen 
	}, delay);	
}

// Screen 3
function loadScreenThree() {
	// use the spinner template
	loadSpinnerTemplate();	
	// create screen object
	const screen3 = { "head":"Loading...", "img":"blocks", "msg":"" };
	// and pass to showSpinner
	showSpinner(screen3);
	// then, after a delay...
	setTimeout(function(){ 
		hideSpinner(); 					// hide the spinner
		loadSaeInfo(metadata); 			// call async function to load json data
		setSaved({"showmenu":true});	// set the showmenu flag to 'true'
		setSaved({"bootmsg":true});		// set boot message flag to 'true'
	}, delay);		
}	
	 	
// Load SAE metadata from JSON file
async function loadSaeInfo(fname){	
	log('loading SAE data...','engine');
	// wait for it...
	let data = await getJSONPromise(fname);
	if (data) { 
		// write to localstorage
		createSaeMetaData(data);
		// and inform the user
		log('data loaded successfully','engine'); 
		// check to see if we have a showmenu flag
		let showmenu = getSaved({"key":"showmenu"});
		// if the showmenu flag is 'true'
		if (showmenu) { 
			// load the SOLACE menu
			loadIframeTemplate('/sae/app/menu/'); 
		}
	}
}

// Show Temp Messages: checks for 'msg' key in datakey
// Allows log messages to be passed between clears, reloads, and redirects
// Mostly set and cleared by appHandOff & appHandBack functions
function showTempMsg() {
	// create a save object and pass to 'getSaved()' function
	let tmpmsg = getSaved({"type":"data","key":"msg"});
	// if we have a message, and it's not blank, show in the console
	if ((tmpmsg) && (tmpmsg != '')) { log(tmpmsg,'yellow'); }	
	// if there are no messages, just return false
	else { return false; }
}

// ------------------------------------------------------	
// APP CONTROL: HANDOFF AND HANDBACK
// ------------------------------------------------------	

// hand-off ui control to a different app
// accepts 1 argument: app to hand off to (including full path)
function appHandOff(app) {
	// if there is no app, show an error
	if (!app) { log('You did not specify which app to hand off control to','error'); return false; }	
	// update Last and Current app values
	updateLastCurrent(dapp,app);
	// remove routemap
	removeRouteMap();
	// save hand-off timestamp
	setSaved({"handoff":tstamp()});
	// clear any previous hand-back values
	setSaved({"handback": ""});
	// store a temporary message in saved-data
	setSaved({"msg":"To return to the SOLACE Menu, exit the current app."});	
	// TODO: call a function here which starts a timer for 3 seconds 
	// The timer checks to see if a callback function has been made if not,
	// control of the UI reverts to SAE which loads default app
	// try to redirect to requested app
	location.href = app;
}

// hand-back ui control to SAE
// accepts 1 argument: app handing back control (including full path)
function appHandBack(app) {
	// if there is no argument, show an error
	if (!app) { 
		log(`No app value was given!`,`error`); 
		log(`Syntax: appHandBack('/path/to/app')`,`solace`);
		return false; 
	}
	// grab existing hand-off timestamp (localStorage)
	var hot = getSaved('handoff');
	// convert to date object 
	var hotdate = isoStringToDate(hot);
	// generate new hand-back timestamp
	var hbt = tstamp();
	// set hand-back timestamp (localStorage)
	setSaved({"handback":hbt});		
	// convert to date object
	var hbtdate = isoStringToDate(hbt);
	// update Last and Current values in localStorage
	updateLastCurrent(app, dapp);
	// create app history object
	const aho = {
		"app": app,
		"handoff": hotdate,
		"handback": hbtdate
	};
	// save app history
	saveAppHistory(aho);
	// delete the temp message key
	deleteSaved('msg');
	// remove routemap
	removeRouteMap();
	// check to see if app is a demo app
	if (appsArr.includes(app)) { 
		// if so, add a hashtag to the url to load the 'installed_apps' template
		// TODO: see if this is still functioning (this should be handled in API)
		location.href = dapp + '#installed'; 
	}
	// otherwise, load the default app
	else {
		location.href = dapp;
	}
}

// Save App History: keep track of last 10 apps
// writes to 'App_History' key in localStorage
// accepts 1 argument: app history object (app, handoff, handback)
function saveAppHistory(obj) {
	// if no object is passed, show an error
	if (!obj) { log('No object passed to function!\nSyntax: saveAppHistory(historyobject)','error'); return false; }
	// assign values
	let app = obj.app;
	let handoff = obj.handoff;
	let handback = obj.handback;
	// grab app history from localStorage
	const apphistory = localStorage.getItem(histkey);
	// if we have existing app history...
	if (apphistory) {
		// calculate difference between two dates
		let diff = diffDatesInMins(handoff,handback);
		// create new app history object with current info
		const apphist = {"app":app,"handoff":handoff.toJSON(),"handback":handback.toJSON(),"mins":diff};
		// parse existing app history array
		let data = JSON.parse(apphistory);
		// if array has less than 10 items, add the current info
		if (data.length < 10){ data.push(apphist); }
		// if array already has 10 items...
		else {
			// remove the oldest item
			data.shift();
			// add new info
			data.push(apphist);
		}
		// write App History to localStorage
		localStorage.setItem(histkey, JSON.stringify(data));	
	}
	// No App History in localStorage? Create a new array and write data to it
	else {		
		const histArr = [];
		let diff = diffDatesInMins(handoff,handback);
		var apphist = {"app":app,"handoff":handoff.toJSON(),"handback":handback.toJSON(),"mins":diff};
		histArr.push(apphist);
		localStorage.setItem(histkey, JSON.stringify(histArr));				
	}
}

// ------------------------------------------------------------------
// DEV USE: NOT USED OR IMPLEMENTED YET
//
// start app handoff -- Hello Mr App Loader!
// helloMrAppLoader();
//
// this generates an error because we didn't pass an app path
// Mr App Loader accepts 1 argument: app path ('/foo/bar/')
//
// helloMrAppLoader('/foo/bar/');
//
// This is the callback after handoff has taken place
// thanksMrAppLoader();
//
// from this point forward, the app has control of the UI
// the user won't see the SOLACE Menu again until they exit
// the current app. Closing the tab or reloading will result
// in the current app reloading until the user quits
//
// DEV USE: Testing HTTP error response codes
var HTTPCode = {
	continue: 100,
	processing: 102,
	success : 200,
	created : 201,
	accepted: 202,
	moved: 301,
	redirect: 308,
	badrequest: 400,
	unauthorized: 401,
	notfound : 404,
	notallowed: 405,
	timeout: 408,
	teapot: 418,
	notimplemented: 501,
	unavailable: 503,
	nostorage: 507
}
//
// DEV USE: "Hello, Hello, Mr App Loader..."
// NOT IMPLEMENTED YET
// starts an app handoff
function helloMrAppLoader(appreq=null) {
	if (appreq) {
		// do more apploader stuff here
		return `Mr AppLoader says: Status ${HTTPCode.accepted} -- "App Request Accepted"`;
	}
	else {
		return `Mr AppLoader says: Status ${HTTPCode.badrequest} Bad Request -- "Tell me which app you want to load"`;	
	}
}
//
// DEV USE: "Thanks Mr App Loader!"
// NOT IMPLEMENTED YET
// callback function which provides return status after handoff
function thanksMrAppLoader() {
	// return a reply and status code (200)
	const msgArr = ["No problemo!","Anytime!","De nada!","You got it!","You're welcome.","Sure!","At your service!","Indeed.","I'm glad you liked it.","Happy to be of service.","Kochira koso!",];
	return `Mr AppLoader says: Status ${HTTPCode.success} OK -- "${msgArr[getRandNum(0,10)]}"`;
	// do some session manipulation stuff here
	// make a callback if needed
}

// AUTO-SEQUENCE START
// function autoSequenceStart() {}