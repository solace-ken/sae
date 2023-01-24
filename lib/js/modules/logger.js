// ----------------------------------------------------------
// logger.js - module for custom console logging
// 
// DEV NOTE:
//
// Did a major update on 1/17/23 to read-in tag values from JSON file
// May have introduced new bugs. Still have issues to work out.
// If log() function is called before tags are loaded to localstorage
// the request(s) will just false and be ignored. This is not ideal behavior.
// I have tried to remedy this with the 'loggerIsReady' flag. But, this whole thing needs work.
//
// TODO: Re-work the log() function to be simpler. Too much redundancy!
//
// NEW APPROACH: 1/17/23
// 
// -- Logger Light (default)
// -- Logger Full (loads during first run after JSON is imported)
// ----------------------------------------------------------

import { verbose, loggerFull, logtest } from "/sae/lib/js/modules/variables.js";
import { isObject } from "/sae/lib/js/modules/functions.js";


// TODO: move this stuff to storage function instead
// TODO: get the JSON importing working too
// TODO: move storage key name to variables.js
// export const tagkey = 'SAE_Logger_Tags';
//
// JSON file containing tag data
//const tagdata = '/sae/lib/json/logger-tags.json';
// try to get tag data from localStorage
// const tdata = localStorage.getItem(tagkey);
// if we don't have data, load it from JSON
// if (!tdata) {
// 	// takes 2 arguments: path to JSON file and callback function
// 	loadJSON(tagdata, processTagData); // <== async function
// }
// create 'tags' object by parsing tdata
//const tags = JSON.parse(tdata);

export const tags = {
	"action": {
		"label": "Action Request",
		"bgcol": "#D50000",
		"txtcol": "white",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"api": {
		"label": "API",
		"bgcol": "#050748",
		"txtcol": "#F8F4E3",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"dev": {
		"label": "Dev Use",
		"bgcol": "black",
		"txtcol": "white",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""
	},
	"engine": {
		"label": "App Engine",
		"bgcol": "#28AFB0",
		"txtcol": "black",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"gui": {
		"label": "GUI",
		"bgcol": "#AA78A6",
		"txtcol": "#070707",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"loader": {
		"label": "Loader",
		"bgcol": "#F0B800",
		"txtcol": "black",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"logger": {
		"label": "Logger",
		"bgcol": "#6B0F1A",
		"txtcol": "white",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"menu": {
		"label": "SOLACE Menu",
		"bgcol": "#502F4C",
		"txtcol": "#FFDDD2",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"router": {
		"label": "Router",
		"bgcol": "#4C1C00",
		"txtcol": "white",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"session": {
		"label": "Session",
		"bgcol": "#0D2E83",
		"txtcol": "white",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"solace": {
		"label": "SOLACE",
		"bgcol": "#0634AA",
		"txtcol": "white",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"storage": {
		"label": "Storage",
		"bgcol": "#EE7674",
		"txtcol": "black",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"ui": {
		"label": "UI",
		"bgcol": "#AA78A6",
		"txtcol": "#070707",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	},
	"view": {
		"label": "Viewport",
		"bgcol": "#4E4E0C",
		"txtcol": "white",
		"msgcolor": "", 
		"bold": "", 
		"logmsg": ""		
	}
};

// Write colored console log messages
// accepts 2 arguments: message and type (optional)
// using type 'obj' (or 'object') allows you to pass custom objects instead of strings
// TODO: the part about logging objects needs to be documented more clearly
export function log(msg,t=null) {

	// if loggerFull is false, we're using loggerLight
	// DEV USE:
	//
	// if (!loggerFull) {
	// 	console.log(`Starting Logger Light...`); 
	// 	// Gentlemen, behold! "Logger Light":
	// 	console.log(t + ': ' + msg); 
	// }

	// if there is no message, show an error
	if (!msg) { console.error(`You didn't pass a message to the log function!`); return false; }

	// TODO: document that log(msg = 'view') is a reserved word
	// Shows viewport dimensions: 
	// message is ignored, type is set to 'view' before going through switch
	if (msg === 'view') { msg = ''; t='view';}

	// show log messages if 'verbose' flag is set to true:	
	if (verbose) {
		// TODO: figure out how to put this into a function instead, reading info from the object.
		// TODO: much of this is just repeated code with different values. Do we have it in the JSON file?
		// TODO: then get all the info from JSON instead of putting it here in javascript

			// figure out what 'type' is and write message to console
			switch(t) {	

				case 'action':
					console.log(`%c${tags.action.label}:%c `+msg,`background-color:${tags.action.bgcol};color:${tags.action.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'api':
					console.log(`%c${tags.api.label}:%c `+msg,`background-color:${tags.api.bgcol};color:${tags.api.txtcol};padding:2px;`,`color:white;`);			
					break;

				// ---------------------------------------------		  
				// CUSTOM MESSAGE: using strings
				// simpler than 'object' but, with fewer features  
				// basic usage: log(`Msg without tag~~msgcolor`,`custom`);
				// tagged word: log(`Msg with {tag}~~msgcolor~~tagcolor`,`custom`);
				// limit is 1 tagged (colored) word per request
				// ---------------------------------------------				  
				case 'custom':
					showCustomMsg(msg);
					break;
				// ---------------------------------------------

				case 'dev':
					console.log(`%c${tags.dev.label}:%c `+msg,`background-color:${tags.dev.bgcol};color:${tags.dev.txtcol};padding:2px;`,`color:white;`);			
					break;		

				case 'engine':
					console.log(`%c${tags.engine.label}:%c `+msg,`background-color:${tags.engine.bgcol};color:${tags.engine.txtcol};padding:2px;`,`color:white;`);
					break;	

				case 'error':
					console.error(msg); // default console error styling
					break;	

				case 'garden':
					console.log(`%c${tags.garden.label}:%c `+msg,`background-color:${tags.garden.bgcol};color:${tags.garden.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'gui':	// alias of 'ui'
					console.log(`%c${tags.gui.label}:%c `+msg,`background-color:${tags.gui.bgcol};color:${tags.gui.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'loader':
					console.log(`%c${tags.loader.label}:%c `+msg,`background-color:${tags.loader.bgcol};color:${tags.loader.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'logger':
					console.log(`%c${tags.logger.label}:%c `+msg,`background-color:${tags.logger.bgcol};color:${tags.logger.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'menu':
					console.log(`%c${tags.menu.label}:%c `+msg,`background-color:${tags.menu.bgcol};color:${tags.menu.txtcol};padding:2px;`,`color:white;`);
					break;	

				// ---------------------------------------------		  
				// CUSTOM MESSAGES: pass objects instead of strings
				// ---------------------------------------------		
				case 'obj':		// alias of 'object'
					printObjMsg(msg);
					break;

				case 'object': // expects 'msg' to be an object
					printObjMsg(msg);
					break;
				// ---------------------------------------------

				case 'router':
					console.log(`%c${tags.router.label}:%c `+msg,`background-color:${tags.router.bgcol};color:${tags.router.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'session':
					console.log(`%c${tags.session.label}:%c `+msg,`background-color:${tags.session.bgcol};color:${tags.session.txtcol};padding:2px;`,`color:white;`);
					break;	

				case 'solace':
					console.log(`%c${tags.solace.label}:%c `+msg,`background-color:${tags.solace.bgcol};color:${tags.solace.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'storage':
					console.log(`%c${tags.storage.label}:%c `+msg,`background-color:${tags.storage.bgcol};color:${tags.storage.txtcol};padding:2px;`,`color:white;`);
					break;	

				case 'ui':  // user interface
					console.log(`%c${tags.ui.label}:%c `+msg,`background-color:${tags.ui.bgcol};color:${tags.ui.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'view': // show viewport width x height (in pixels) - label is 'UI'
					console.log(`%c${tags.view.label}:%c ${window.innerWidth} px wide x ${window.innerHeight} px high`,`background-color:${tags.view.bgcol};color:${tags.view.txtcol};padding:2px;`,`color:white;`);
					break;

				case 'warn':
					console.warn(msg); // default console warn styling
					break;

				case 'y': // alias of 'yellow'
					console.log(`%c${msg}`,`color:yellow;font-weight:bold;`);
					break;	

				case 'yellow': // shows bold yellow message
					console.log(`%c${msg}`,`color:yellow;font-weight:bold;`);
					break;

				default:
				// if msg is an object, show an error and fail
				if (isObject(msg)){ console.error(`Invalid log type request: expecting string`); return false; }
				// if msg is a string, and we have no type, just log to console with no styling
				else { console.log(msg); }
			}		
	}
	// if verbose is false, return false for log requests
	else { return false; }		
}

	// DEV USE:
	// if dev mode is on, show the variables being passed to log function
	// if (devmode) {
	// 	console.log('Log Message value is: ' + msg);
	// 	console.log('Log Type value is: ' + t);	
	// }

// CUSTOM MESSAGE: BASIC STYLING
// simpler than 'object' (but with fewer features) 
//
// usage: log(`Msg without tag~~msgcolor`,`custom`);
// tagged word: log(`Msg with {tag}~~msgcolor~~tagcolor`,`custom`);
//
// limit is 1 tagged word per message!
//
function showCustomMsg(msg) {	
	// split string on double tilde (~~)
	// array limit 3: (0) message, (1) text color, and (2) tag color
	// extra tag colors will be ignored
	const custArr = msg.split('~~',3);
	var m = custArr[0];		// message we are writing to the console (possibly tagged)
	var mc = custArr[1];	// message color
	var tc = custArr[2];	// tag color
	// regex pattern: match word between curly braces: {tag}
	var rxp = /(?<=\{).+?(?=\})/g;  
	// use regex to check if we have tags
	const tag = m.match(rxp);
	// if there are no tags - show message in requested message color
	if (!tag) { console.log(`%c${m}`,`color:${mc}`); }	
	// if we have a tag, split the message
	else { 	
		var word = '{'+tag[0]+'}';		// use tagged word as separator
		const mpArr = m.split(word); 	// save values to message parts array
		// if we have more than one custom tag, show an error
		if (tag.length > 1) { 
			console.error('You can only use one custom-colored tag per message.\nTry using a custom message object instead.'); 
			// but, print the message and color the first tag - ignore the rest
			console.log(`%c${mpArr[0]}%c${tag[0]}%c${mpArr[1]}`,`color:${mc}`,`color:${tc}`,`color:${mc}`);
			return false;
		}
		// display in tag color - with rest of message appearing in message color	
		console.log(`%c${mpArr[0]}%c${tag[0]}%c${mpArr[1]}`,`color:${mc}`,`color:${tc}`,`color:${mc}`); 
	}
	return true;
}

// TODO: integrate this into logger-tags.json file
// TODO: need to make sure we have all 6 options:
// TODO: label, bgcol, txtcol, msgcolor, bold, logmsg
//
// CUSTOM MESSAGE: ADVANCED STYLING
// Print object message to the console
// accepts 1 argument: message object (required)
// 
// message object should contain: 
//
// label - the label to display
// background - label background color
// color - label text color
// msgcolor - message text color
// bold - (true|false) - show bold message text
// message - the message to display
//
// Usage example:
//
// const custMsg = {
//     "label":"Foobar",
//	   "background":"red",
//	   "color":"white",
//     "msgcolor":"white",
//     "bold": true,
//     "message": "This is a sample custom object message"	
// };
// log(custMsg,'obj');
// 

// don't call this function directly!
// only 'log()' function should be calling this
function printObjMsg(msg) {
	// make sure it exists, and is an object
	if ((msg) && (isObject(msg))) { 
		// bold flag is true - show bold text
		if (msg.bold) { 
			console.log(`%c${msg.label}:%c ${msg.message}`,`background-color:${msg.background};color:${msg.color};padding:2px;`,`color:${msg.msgcolor}; font-weight:bold;`); 
		}
		//  bold flag is false - show regular text
		else { 
			console.log(`%c${msg.tag}:%c ${msg.message}`,`background-color:${msg.background};color:${msg.color};padding:2px;`,`color:${msg.msgcolor}`); 
		}
		return true;
	}
	// if there's a problem, show an error
	else { console.error(`Logging Error!\nYou have to pass an object containing valid data. Check the specs and try again.`); return false; }
}

// process the response from JSON File Loader , amd write to localStorage
// TODO: move this to 'storage.js' because it writes to storage
// function processTagData(data) {
// 	// we have data...
// 	if (data) {
// 		localStorage.setItem(tagkey, JSON.stringify(data));
// 		console.log('Tag data added to localStorage', data);
// 		// set 'Logger Full' to true
// 		loggerFull = 'true';
// 		// reload page (a work-around)
// 		location.reload();
// 	}
// 	// no data
// 	else { console.error(`The loadJSON() function didn't return any data`); return false; }
// }

// Verbosity level
if (verbose) { 
	// TODO: make sure this info only shows once at boot
	// inform the user that verbose logging is enabled
	//log('logger.js loaded','loader');
	//log('verbose logging enabled','logger');
}
// or, explain how to enabled it
else { 
	console.groupCollapsed('SOLACE App Engine (SAE)');
	console.log('Enable verbose logging in logger.js to see additional console info');
	console.groupEnd();
}

// -----------------------------------------------------
// DEV USE: log test (requires verbose to be true)
// output messages to console to check the labels
// -----------------------------------------------------
if ((logtest) && (verbose)) {
	// create a new custom message object
	const custMsg = {
		"label":"Custom Tag",
		"background":"white",
		"color":"red",
		"msgcolor":"orange",
		"bold": true,
		"message": "This is a sample custom object message with custom tag"	
	};
	// clear the console
	console.clear();
	// test message text
	const logmsg = 'Testing the console output of logger.js';
	// Test Start message
	console.log('%cStarting console log test:\n\n','color:limegreen;font-weight:bold;');
	// test predefined labels
	log(logmsg,'action');
	log(logmsg,'boot');
	log(logmsg,'dev');
	log(logmsg,'engine');
	log(logmsg,'error');
	log(logmsg,'garden');
	log(logmsg,'gui');
	log(logmsg,'loader');
	log(logmsg,'logger');
	log(logmsg,'menu');
	log(logmsg,'router');
	log(logmsg,'session');
	log(logmsg,'solace');
	log(logmsg,'storage');
	log(logmsg,'ui');
	log('view');
	log(logmsg,'warn');
	log('Yellow (alias): ' + logmsg,'y');	
	log('Yellow: ' + logmsg,'yellow');
	// test custom error messages
	log('This is a custom message without tags!~~red','custom');
	log('This is a custom message {with colored tags}~~red~~limegreen','custom');
	// test error object message
	log(custMsg,'obj');	
	// Test End message
	console.log('\n\n%cConsole log test complete','color:limegreen;font-weight:bold;');
} else {
	// this error is displayed if verbose is set to false & logtest is true
	if ((verbose == false) && (logtest == true)) {
		console.warn(`Log test value is set to true but, 'verbose' value is false. Verbose also needs to be true in 'logger.js' to display test output`);
	}
}

