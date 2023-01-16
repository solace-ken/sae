// ------------------------------------------------------------------------------------------------------------
// sae.js - SOLACE App Engine (SAE)
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
// checks device storage
// sets SOLACE session
// manages storage and sessions
// monitors online status
// provides api access to gui elements for other scripts
// manages loading / unloading of 3rd party apps
// handles version control and updates
// 
// created in 2022 by ken@solace.network
//
// last updated: 01/14/23
//
// ------------------------------------------------------------------------------------------------------------	

// if logger.js isn't loaded, define the log function
if (!(typeof log==='function')){console.log('logger.js is not loaded');function log(msg,t=null){console.log(msg);}}

// -------------
// VARIABLES
// -------------

// default app
const dapp = 'menu';

// SOLACE App Engine JSON meta-data
const metadata = 'lib/sae.json';

// active apps
// to deactive an app, remove from this array
const appsArr = [			
	'dcb',
	'menu',
	'sample1',
	'sample2',
	'sample3',
	'sample4'
];

// disable browser back button? (default = true)
const disableback = true;
// TODO: when devmode is enabled, don't disable back button

// storage key names:
const aekey = 'SOLACE_App_Engine';		// SOLACE App Engine
const cappkey = 'SAE_Current';			// Current app
const lappkey = 'SAE_Last';				// Last-used app
const histkey = 'SAE_Recent';	 		// App history (last 10 apps used)
const savedkey = 'SAE_Data';	 		// Saved-data
const backupkey = 'Session_Backup';		// Session backup (in localStorage)

// images
const logosvg = '/lib/img/solace-logo.svg';				// SOLACE scalable vector graphic logo
const errsvg = '/lib/img/error.svg';					// error image (exclamation mark in triangle)
const geargif = '/lib/img/gears.gif';					// gears spinner (animated GIF)
const blockgif = '/lib/img/square-loader.gif';			// blocks spinner (animated GIF)

// ------------------------------------------------------------------------------------------------------------	
// PAGE ELEMENTS (make sure they exist)
// ------------------------------------------------------------------------------------------------------------	

// UI (target div)
if (document.getElementById('ui')) { const ui = document.getElementById('ui'); }

// Logo Template
if (document.getElementById('logotpl')) { const logotpl = document.getElementById('logotpl'); }

// Spinner Template
if (document.getElementById('spintpl')) { const spintpl = document.getElementById('spintpl'); }

// Error Template
if (document.getElementById('errtpl')) { const errtpl = document.getElementById('errtpl'); }

// iFrame Template
if (document.getElementById('iframetpl')) { const iframetpl = document.getElementById('frametpl'); }

// ------------------------------------------------------------------------------------------------------------	
// TEST FOR STORAGE
// ------------------------------------------------------------------------------------------------------------	

// logging	
log('checking storage...','engine'); 

// load the logo template
loadLogoTemplate();

// show the logo
showLogo('fadeinspin');

fadeOutSpinLogo();

// test to see if storage is available...
if (checkForStorage()) {

	log('storage check - OK','engine');

	// check to see if we have saved data and load SOLACE Menu
	if (checkForSaved()) { 
		console.log('We have saved data');
		setTimeout(function(){ loadSpinnerTemplate(); loadScreenThree(); },2000)
		//startSolaceMenu();
	} else {
		console.log('No saved data');
		console.log('We have saved data');
		setTimeout(function(){ loadSpinnerTemplate(); loadScreenThree(); },2000)
	}

} else { 	
	// if no storage,
	hideLogo();
	// create error object
	let error = { "title":"Error! No Storage Available", "cause":"The app couldn't access the hard drive (or memory) on your device and is unable to start.", "solution":"Check your device settings and try to reload." };
	// load the error template
	useErrorTemplate();
	// display the error
	showError(error);
} 

// ------------------------------------------------------------------------------------------------------------
// TEMPLATE DISPLAY CONTROL (SHOW/HIDE)
// ------------------------------------------------------------------------------------------------------------

// Logo Template
function loadLogoTemplate() {
	ui.innerHTML = loadTemplate('logotpl');
	ui.style.display = 'block';
}

// Spinner Template
function loadSpinnerTemplate() {
	ui.innerHTML = loadTemplate('spintpl');
	ui.style.display = 'block';	
}

// Error Template
function loadErrorTemplate() {
	ui.innerHTML = loadTemplate('errtpl');
	ui.style.display = 'block';
}

// Iframe Template
function loadIframeTemplate() {
	ui.innerHTML = loadTemplate('frametpl');
	ui.style.display = 'block';
}

// Show logo: 
// accepts 1 optional argument: sfx (special effects)
// options are: 'spin', 'fadeinspin', or 'fadeoutspin'
// if no arguments are passed, a static logo will display
function showLogo(sfx=null) {
	var mylogo = document.getElementById('logo');
	if (mylogo) {
		// if display is set to none, make visible
		if (mylogo.style.display === 'none') { mylogo.style.display = 'block'; }
		// if special effects are requested, add them...
		if (sfx === 'spin') { mylogo.classList.add('spin'); }
		if (sfx === 'fadeinspin') { mylogo.classList.add('fadeinspin'); }	
		if (sfx === 'fadeoutspin') { mylogo.classList.add('fadeoutspin'); }
	} 
	// otherwise, give an error and return false
	else {
		log('There is no logo element in the requested template to show','error');
		return false;
	}
}

// Hide logo:
function hideLogo() {
	// make sure we have a page element
	if (document.getElementById('logo')) {
		// if we do, hide the logo
		document.getElementById('logo').style.display = 'none';
	} else { 
		// otherwise, give an error and return false
		log('There is no logo element in the requested template to hide','error');
		return false;
	}
}

// Fade out spin logo: 2 functions grouped together
// runs 'fadeoutspin' keyframe animation then calls
// 'hideLogo()' 1.4 seconds later. This prevents the
// flicker effect which occurs when animation finishes
function fadeOutSpinLogo() {
	// spin the logo and fade-out
	showLogo('fadeoutspin');
	// after fade-out, hide logo to avoid flicker
	setTimeout('hideLogo()', 1400);
}

// show error: requires Error Template
// accepts 1 argument: error object (title, cause, solution )
function showError(obj) {
	if (!obj) { console.error('There is no error object to display'); return false; }
	document.getElementById('errmsg').style.display = 'block';
	document.getElementById('title').innerHTML = obj.title;
	document.getElementById('cause').innerHTML = obj.cause;
	document.getElementById('solution').innerHTML = obj.solution;	
}

// hide error: requires Error Template
function hideError() {
	document.getElementById('errmsg').style.display = 'none';
}

// show spinner: requires Spinner Template
// accepts 1 argument: spinner object (header, image, message)
// image options are: 'gears' or 'blocks'
function showSpinner(obj) {
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
function clearSpinner(){
	let spinzone = document.getElementById('spinner');
	if (spinzone) {
		document.getElementById('header').innerText = '';
		document.getElementById('statmsg').innerText = '';
		return true;
	}
	else { return false; }
}

// hide spinner: requires Spinner Template
function hideSpinner() { document.getElementById('spinner').style.display = 'none'; }

// show and hide gears: requires Spinner Template
function showGears() { document.getElementById('gears').style.display = 'block'; }
function hideGears() { document.getElementById('gears').style.display = 'none';	}

// show and hide blocks: requires Spinner Template
function showBlocks() { document.getElementById('blocks').style.display = 'block'; }
function hideBlocks() { document.getElementById('blocks').style.display = 'none'; }

// show generic spinner (used by api.js)
function showGenericSpinner() {
    // create a generic spinner object
    let gsp = {
    	"header": "This Is A Sample Heading",
        "spinner": "gears",
        "statmsg": "You can customize spinners by passing data"
    };
    // and show the spinner
    log('Showing generic spinner', 'engine');
    showSpinner(gsp); 	
}

// ------------------------------------------------------------------------------------------------------------

// Temp Messages: checks temp msg in saved-data and logs result
// Msg is set and cleared by appHandOff & appHandBack functions
// Allows console messages between console clears, reloads, and redirects
function showTempMsg() {
	let tmpmsg = getSaved('msg');
	if ((tmpmsg) && (tmpmsg != '')) { log(tmpmsg,'engine'); }	
}

// --------------------------------------------------------
// STORAGE FUNCTIONS:
// --------------------------------------------------------

// Get saved data: 
// accepts 1 optional argument: key
// if no key is passed,  function will parse and return the entire object
// otherwise, it returns only the value of the requested key
function getSaved(key=null) {
	// get saved data from localStorage
	// TODO: make sure we have checked for localstorage first
	var sd = localStorage.getItem(savedkey);
	// if we have data
	if (sd) { 
		// parse it
		var data = JSON.parse(sd);
		// if we have a key, only return value key
		if (key) {		
			// create empty value
			let val;
			// run key through switch
			switch(key) {
				case 'v':
				  val = data.v;			// viewport dimensions
				  break;
				case 'online':
				  val = data.online;	// online status
				  break;
				case 'platform':
				  val = data.platform; 	// platform data
				  break;
				case 'agent':
				  val = data.agent;		// user agent data
				  break;
				case 'firstrun':
				  val = data.firstrun;	// first-run flag
				  break;
				case 'handoff':
				  val = data.handoff;	// hand-off timestamp
				  break;
				case 'handback':		
				  val = data.handback;	// hand-back timestamp
				  break;
				case 'msg':
				  val = data.msg;   	// temp messages
				  break;
				default: 
				  val = null;
			}
			// return the value
			return val;
		}
		else { return data; } // no key = return entire object
	}
	// no saved-data, return false
	else { return false; }
}

// generate a new data object with system info
// accepts 1 argument: platform value
function newDataObj(platform) {
	const sdo = {
		"viewport": { "width":window.innerWidth, "height":window.innerHeight },
		"online": navigator.onLine,
		"platform": platform,
		"agent": navigator.userAgent,
	};
	return sdo; 
}

// create saved-data object (savedkey)
function createSaved() {
	// if Saved Data object already exists, do nothing
	if (localStorage.getItem(savedkey)) { return false; }
	// otherwise, create new one
	else {
		// if we're on Chrome, get userAgentData
		if(navigator.userAgentData) {
			navigator.userAgentData.getHighEntropyValues(["architecture","platform"])
				.then((data) => { 
					let platform = data.platform +' '+ data.architecture;
					let newObj = newDataObj(platform);
					// console.log('New object is: ', newObj);
					// stringify, save to localStorage and return the object
					localStorage.setItem(savedkey, JSON.stringify(newObj));
				});
		} 
		// otherwise use 'navigator.platform' value 
		else {
			// create the object
			let newObj = newDataObj(navigator.platform);
			// console.log('New object is: ', newObj);
			// stringify, save to localStorage and return the object
			localStorage.setItem(savedkey, JSON.stringify(newObj));		
			return sdo;
		}
	}	
}

// Delete saved-data key
// accepts 1 argument: key (required)
function deleteSaved(key) {
	// if there is no key, show error
	if (!key) { console.error('Key is required!'); return false; }
	// if user is trying to delete required SAE keys, show error
	const blocked = ['v','online','platform','agent','firstrun'];
	// all other keys (besides these) can be deleted
	if (blocked.includes(key)) {
		console.error('You cannot delete required system keys');
		return false;
	}
	// create match variable
	let match = false;
	// get saved-data object
	let sd = getSaved();
	// cycle through object, 
	for (let m in sd) { 
		// if keys match, 
		if (m === key ) { 
			// update match
			match = true;
			// delete requested key
			delete sd[m]; 
			// and update localStorage
			localStorage.setItem(savedkey,JSON.stringify(sd));
			return true;
		} 
	}
	// if there is no match, show error
	if (!match) {
		console.error(`deleteSaved: Key "${key}" does not exist`);
		return false;
	}	
}

// Set existing values to new values
// expects an object containing data
// and the value of savedkey from solace.js
function setSaved(newdata) {	
	// if newdata is empty, show error
	if (!newdata) { console.error('There is nothing to save.'); return false; }
	// get existing saved-data key
	const sdk =  localStorage.getItem(savedkey);
	// if it fails, give an error
	if (!sdk) { console.error('Saved-data key does not exist.'); return false; }
	// parse saved-data
	const pdata = JSON.parse(sdk);
	// create a new object and merge newdata with existing saved-data
	let newobject = Object.assign(pdata, newdata);
	// write new values to localStorage
	localStorage.setItem(savedkey, JSON.stringify(newobject));
	return true;
}

// check for saved data storage key
function checkForSaved() {
	// try to get saved data
	let saved = getSaved();
	// if it exists, just return true
	if (saved) { return true; }
	// if saved data doesn't exist, create it
	else {
		createSaved();
		return false;
	}
}

// Get App Engine meta-data
// returns meta-data object, or false
function getMetaData() {
	let md = localStorage.getItem(aekey);
	// If it doesn't exist, return false
	if (!md) { return false; }
	else {
		// parse it and return object 
		let data = JSON.parse(md);
		return data
	}	
}

// Create SAE meta-data
// Accepts 1 argument: an object containing JSON data
function createMetaData(data) {
	  // create new SAE object
	const sae = {	
	  "name": data.name,
	  "version": data.version,
	  "subversion": data.subversion,
	  "releasedate": data.releasedate,
	  "author": data.author,
	  "path": data.path,
	  "logo": data.logo,
	  "icon": data.icon,
	  "brand": data.brand,
	  "key": data.key,
	  "site": data.site,
	  "support": data.support,
	  "api": data.api,
	  "token": generateToken(32)
  };
  // save to localStorage
  localStorage.setItem(aekey, JSON.stringify(sae));
}

// Get Last Used App
function getLastApp(lappkey) {
	var lapp = sessionStorage.getItem(lappkey);
	if (!lapp) { return false; }
	var pval = JSON.parse(lapp);
	return pval;
}

// Update localStorage for last and current apps
function updateLastCurrent(lastapp,currentapp) {
	if ((!lastapp)||(!currentapp)) { console.error('Syntax: updateLastCurrent(lastapp,currentapp)'); return false; }
	// update current app
	localStorage.setItem(cappkey, currentapp);
	// update last app
	localStorage.setItem(lappkey, lastapp);
}

// ---------------------------------------------------
// STORAGE CHECK
// borrowed from MDN docs: 
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
// ---------------------------------------------------

// check if storage is available (returns true|false)
function checkForStorage(){
	let ls = storageAvailable('localStorage');
	let ss = storageAvailable('sessionStorage');
	// storage available
	if ((ls)&&(ss)) { return true; }
	// no storage
	else { return false; }
}

// Test storage, by writing to it 
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

// -----------------------------------------------------
// SESSION MANAGEMENT
// -----------------------------------------------------

// Check SOLACE session (or redirect)
function checkSession() {
	// check for SOLACE session (true|false)
	const ss = sessionStorage.getItem('SOLACE');
	// no session: 
	if (!ss) {	
		// look for a backup copy in localStorage
		let check = checkBackupSession(backupkey);
		// if there isn't one, redirect to root
		if (!check) { location.href = '/'; }
		// otherwise, update values
		else { 
			// save to sessionStorage
			sessionStorage.setItem('SOLACE', JSON.stringify(check)); 
			// save another backup copy to localStorage
			localStorage.setItem(backupkey, JSON.stringify(check));
			return true;
		}
	}
	// TODO: add 'checkSessionTime' functionality here
	// if user has a session, return true
	else { return true; }
}

// SOLACE session
// checks storage and sets new SOLACE session
function solaceSession() {
	// check for SOLACE session (true|false)
	const ss = sessionStorage.getItem('SOLACE');
	// if we don't have a session, 
	// create a new session object
	const t = { "SOLACE": true, "timestamp": tstamp() };
	if (!ss) { 
		// save to sessionStorage
		sessionStorage.setItem('SOLACE', JSON.stringify(t)); 
		// also save backup copy to localStorage
		localStorage.setItem(backupkey, JSON.stringify(t));
	}
	return true;
}

// Check for backup session in localStorage
function checkBackupSession(backupkey) {
	// try get the backup
	let bkup = localStorage.getItem(backupkey);
	// no backup
	if (!bkup) { return false; }
	// we have a backup:
	else {
		log('Backup session found','engine');
		log('Restoring backup session','engine');
		// parse and return object
		let data = JSON.parse(bkup);
		return data;
	}
} 

// ------------------------------------------------------
// LOADING SEQUENCE WATERFALL:
// ------------------------------------------------------

// Screen 1
function loadScreenOne() {
	// use the spinner template
	useSpinnerTemplate();
	// create screen object
	const screen1 = { "header":"Checking", "spinner":"gears", "statmsg":"Session Data" };
	// pass to showSpinner
	showSpinner(screen1);
	// then, after a delay...
	setTimeout(function(){ 
		clearSpinner();  // clear header and statmsg text
		checkForSaved(); // check for saved data, if not, create it
		loadScreenTwo(); // load the next screen		
	}, delay);
}	

// Screen 2
function loadScreenTwo() {
	// create screen object
	const screen2 = { "header":"Checking", "spinner":"gears", "statmsg":"Saved Data" };
	// and pass to showSpinner
	showSpinner(screen2);
	// then, after a delay...
	setTimeout(function(){ 
		hideGears();     	// hide the gears animation
		loadScreenThree(); // load the next screen 
	}, delay);	
}

// Screen 3
function loadScreenThree() {
	// create screen object
	const screen3 = { "header":"Loading...", "image":"blocks", "message":"" };
	// and pass to showSpinner
	showSpinner(screen3);
	// then, after a delay...
	setTimeout(function(){ 
		hideSpinner(); 				// hide the spinner 
		loadAppInfo(metadata); 		// call async function to load json data
	}, delay);		
}

// DEV USE: will be deprecated in future
// TODO: moving async function to functions.js
//
// Load meta-data from JSON file
async function loadAppInfo(fname){	
	log('Loading SAE data...','engine');
	// wait for it...
	let data = await getJSONPromise(fname);
	// create new App Engine key (storage.js)
	createMetaData(data);
	// create app data storage key (storage.js)
	createSaved();
	// set 'firstrun' flag (storage.js)
	setSaved({"firstrun":true});
	// Logging 
	if (data) { log('Data loaded successfully','engine'); }	
	// load the iFrame template
	loadIframeTemplate();
	// then, load the SOLACE Menu in the iframe
	document.getElementById('appframe').src = 'app/menu/';
}

// ------------------------------------------------------	
// APP CONTROL: HANDOFF AND HANDBACK
// ------------------------------------------------------	

// hand-off ui control to different app
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
function doneResizing() { log('window resized','view'); }

// network status: ONLINE - green icon
window.addEventListener('online', function(e) { 
	let dot = document.getElementById('dot');
	if (dot) { 
		dot.src =  greendot; 
		dot.title = 'Status: ONLINE';
	}
	setSaved({"online":true}); // update saved value
});

// network status: OFFLINE - red icon
window.addEventListener('offline', function(e) {
	let dot = document.getElementById('dot');
	if (dot) {
		dot.src = reddot; 
		dot.title = 'Status: OFFLINE'; 
	}
	setSaved({"online":false}); // update saved value
});

// ------------------------------------------------------------------
// AUTO SEQUENCE START: functions that start automatically
// ------------------------------------------------------------------

function autoSequenceStart() {
	console.log('Auto Sequence Start has been called');
}

// ------------------------------------------------------------------

// disable browser back button
if (disableback) {
	history.pushState(null, null, location.href);
	window.onpopstate = function () { history.go(1); };
}

// ------------------------------------------------------------------
// DEV USE: functions under development or used for testing
// ------------------------------------------------------------------

// Mr App Loader - callback - provides return status after app handoff
function thanksMrAppLoader(){
	// send a reply
	const msgArr = ["No problemo!","Anytime!","De nada!","You got it!","You're welcome.","Sure!","At your service!","Indeed.","I'm glad you liked it.","Happy to be of service.","Kochira koso!",];
	return `Mr AppLoader says: "${msgArr[getRandNum(0,10)]}"`;
	// do some session manipulation stuff here
	// make a callback
}
// dev use: testing Mr App Loader
// log(`"Thanks Mr. Apploader"`, 'dev')
// log(thanksMrAppLoader(), 'engine');

// New Custom Storage Key - not currently used
// accepts 2 arguments: key name and object (optional)
// if no object is passed, an empty key will be created
// otherwise, object data will be added to custom key and saved
function newCustomKey(name,obj=null) {
	// if there is no name passed, show, show an error
	if (!name) { 
		console.error('Key name is required'); 
		console.log(`Syntax: newCustomKey(name,obj)`); 
		return false; 
	}
	// if the key name already exists, show an error
	if (localStorage.getItem(name)) { 
		console.error('That key name already exists'); 
		console.log('Either pick a new key name, or use saveCustomKey()');
		return false; 
	}
	// if the user is not passing an object, save empty object
	if (!obj) {
		localStorage.setItem(name,{});
	}
	// if we have an object
	if (obj) {   		
		localStorage.setItem(savedkey, JSON.stringify(obj));		
	}	
}

// check session timestamp
// NOT IMPLEMENTED YET 
// TODO: modify createMetaData function to allow old token reuse
// 
function checkSessionTime() {
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
}

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

log('sae.js loaded','loader');