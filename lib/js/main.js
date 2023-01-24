// ------------------------------------------------------------------------------------------------------------
// main.js - SOLACE App Engine (SAE): 
// A system for managing smaller, self-contained, Javascript apps
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
// sets SOLACE session
// manages storage and sessions
// monitors online status
// provides api access to gui elements for other scripts
// manages loading / unloading of 3rd party apps
// handles version control and updates
// 
// created in 2022 by Ken Dawson <ken@solace.network>
//
// last updated: 01/23/23
//
// ------------------------------------------------------------------------------------------------------------	

// IMPORT DATA AND FUNCTIONS:

//import { metadata } from "/sae/lib/js/modules/variables.js";
import { 
	tstamp, 
	getRandNum, 
	isEmpty, 
	showSuccessMsg 
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
	showSpinner
} from "/sae/lib/js/modules/ui.js";
import { 
	checkForStorage,
	checkForSaved,
	getSaved,
	setSaved,
	generateNewSaved,
	generateMetaData
} from "/sae/lib/js/modules/storage.js";
import { 
	solaceSession, 
	getStartTime, 
	checkSession 
} from "/sae/lib/js/modules/session.js";
import { 
	params 
} from "/sae/lib/js/modules/api.js";
import "/sae/lib/js/modules/router.js";

// ------------------------------------------
// MAIN PROGRAM
// ------------------------------------------

// Check to see if we have URL parameters
// if none, we have no API requests
if (isEmpty(params)) {

	log('We have no URL parameters','dev');

	// load the logo template
	loadLogoTemplate();
	// show the fade-in spin logo
	showLogo('spin');

	// start logging	
	log('checking device storage...','engine'); 

	// test if device storage is available
	if (checkForStorage()) {

		// yes, we have working device storage!
		log('storage check - OK','engine');

		// DEV USE: TESTING
		const loaddata = false;
		if (loaddata) {
			setSaved({"type":"data","firstrun":false,"current":"/sae/","msg":"This is a test of TMP message"});	
		}
		else {
			var firstrun = getSaved({"type":"data","key":"firstrun"});
			if (firstrun === null) { console.log('Key does not exist'); }
			else { log('First run value is: ' + firstrun,'dev'); showTempMsg(); showSuccessMsg(); }
		}
	} 
	// no device storage!
	else { 	
		// hide the logo 
		hideLogo();
		// create an error object
		let error = { "title":"No Device Storage Available", "cause":"This application can't access the hard drive (or memory) of your device", "solution":"This error can be caused by having cookies disabled. To use the app, you must have cookies enabled. Check your device storage and/or browser settings and try reloading the site again." };
		// load the error template
		loadErrorTemplate();
		// display the error
		showError(error);
	}

}
// if we have API requests, let the api module control the screen drawing
else {
	log(`Params is: ${JSON.stringify(params)}`, 'dev');
}

// ------------------------------------------
// FUNCTIONS
// ------------------------------------------

// Show Temp Messages: checks for 'msg' key in saved-data
// Allows log messages to be passed between clears, reloads, and redirects
// Mostly set and cleared by appHandOff & appHandBack functions
function showTempMsg() {
	// create a save object and pass to 'getSaved()' function
	let tmpmsg = getSaved({"type":"data","key":"msg"});
	// if we have a message, and it's not blank, show in the console
	if ((tmpmsg) && (tmpmsg != '')) { log(tmpmsg,'dev'); }	
	// if there are no messages, just return false
	else { return false; }
}

// TODO: move this to storage.js...
function loadEngineInfo(data){	
	log('Loading SAE metadata from JSON...','engine');
	// if we have data...
	if (data) { 
		//log('SAE metadata loaded successfully','engine'); 
		generateMetaData(data);
		// create app data storage key (storage.js)

		// TODO: need to update createSaved() and setSaved() to use new object functions 
		//createSaved();
		
		// set 'firstrun' flag (storage.js)
		//setSaved({"firstrun":true});
		
		// load the iFrame template (passing url to load)
		loadIframeTemplate();		
	}
	else { log('No data was received from the loadJSON() function','error'); return false; }
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

// DEV USE: Testing HTTP error response codes
// TODO: move this to another file
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

// DEV USE: "Hello, Mr App Loader..."
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

// DEV USE: "Thanks Mr App Loader!"
// callback function which provides return status after handoff
function thanksMrAppLoader(){
	// return a reply and status code (200)
	const msgArr = ["No problemo!","Anytime!","De nada!","You got it!","You're welcome.","Sure!","At your service!","Indeed.","I'm glad you liked it.","Happy to be of service.","Kochira koso!",];
	return `Mr AppLoader says: Status ${HTTPCode.success} OK -- "${msgArr[getRandNum(0,10)]}"`;
	// do some session manipulation stuff here
	// make a callback if needed
}

// DEV USE:
// start app handoff -- Hello Mr App Loader!
	// helloMrAppLoader();
//
// this generates an error because we didn't pass an app name
// Mr App Loader accepts 1 argument: app name ('/foo/bar/')
	// helloMrAppLoader('/foo/bar/');
//
// This is the callback after handoff has taken place
	// thanksMrAppLoader();
// from this point forward, the app has control of the UI
// the user won't see the SOLACE Menu again until they exit
// the current app. Closing the tab or reloading will result
// in the current app reloading until the user quits


// ------------------------------------------------------------------
// AUTO-SEQUENCE START: start up functions at launch
// ------------------------------------------------------------------

function autoSequenceStart() {
	log(`"We have a go for auto-sequence start."`,'engine');
	// put functions here that need to start up at run-time...
	// do stuff
}

// ------------------------------------------------------------------
// DEV USE: NOT USED OR IMPLEMENTED YET
//
// functions under development or being used for test purposes
// test out new stuff here first before messing up the main code
//
// ------------------------------------------------------------------

// New Custom Storage Key - not currently used
// accepts 2 arguments: key name and object (optional)
// if no object is passed, an empty key will be created
// otherwise, object data will be added to custom key and saved
// function newCustomKey(name,obj=null) {
// 	// if there is no name passed, show, show an error
// 	if (!name) { 
// 		console.error('Key name is required'); 
// 		console.log(`Syntax: newCustomKey(name,obj)`); 
// 		return false; 
// 	}
// 	// if the key name already exists, show an error
// 	if (localStorage.getItem(name)) { 
// 		console.error('That key name already exists'); 
// 		console.log('Either pick a new key name, or use saveCustomKey()');
// 		return false; 
// 	}
// 	// if the user is not passing an object, save empty object
// 	if (!obj) {
// 		localStorage.setItem(name,{});
// 	}
// 	// if we have an object
// 	if (obj) {   		
// 		localStorage.setItem(datakey, JSON.stringify(obj));		
// 	}	
// }

// check session timestamp
// NOT IMPLEMENTED YET 
// TODO: modify createMetaData function to allow old token reuse first
// 
/* function checkSessionTime() {
	// parse it
	let app = JSON.parse(bkup);
	// convert ISO string to javascript date object
	let jsdate = isoStringToDate(app.timestamp);
	// grab the current time
	let rightnow = new Date();
	// calculate difference between two dates 
	let diff = rightnow.valueOf() - jsdate.valueOf();
	// convert milliseconds to hours
	let diffInHours = diff/1000/60/60;	
	// if timestamp is more than 12 hours old
	if (diffInHours > 12) {
		// refresh session info but, keep same token
		log('Refreshing session with current token','engine');
		//createMetaData(app.token);
		return true;
	}
	// if timestamp is not 12 hours old, keep using it
	else { return true; }		
} */

// DEV USE: not implemented yet
// const startapp = '';		// User pref for app to autostart

// testing: trigger function on image load
// go to Network Module to run this function
/* function testFun() {
	var foo = 325 + 105;
	var msg = `This message was triggered by a 1x1 px hidden image.`;
	log(msg,'dev');
	log(`This is an interpolated value: ${foo}`,'dev');
	log('Watch the status light (on the lower right) turn blue','dev');
	setTimeout(function(){ document.getElementById('dot').src = '/lib/img/circle-blue-filled.svg'; log('We can also change the page text','dev'); }, 10000);
	setTimeout(function(){ document.getElementById('tt').innerText = 'This is some new text right here'; }, 10000);
} */

// TODO: make sure this only loads one time
//log('sae.js loaded','loader');