// ----------------------------------------------------------
// logger.js - module for custom console logging
// 
// ----------------------------------------------------------

// verbose console logging? (shows extra info)
const verbose = true;

// -----------------------
// DEV USE: view test log messages
// requires 'verbose' to be set to true
const logtest = false;
// -----------------------

// tags object (keeps colors and labels in one easy-to-edit place)
// TODO: move this to an external JSON file
const tags = 
{
	"action": {
		"label": "Action Request",
		"bg": "#D50000",			// red
		"txt": "#FFFFFF"			// white
	},
	"api": {
		"label": "API",
		"bg": "#050748",			// dark blue
		"txt": "#F8F4E3"			// grayish
	},
	"directory": {				// DEV NOTE: not implemented yet
		"label": "Foobar",
		"bg": "",
		"txt": ""
	},
	"dev": {
		"label": "Dev Use",
		"bg": "#000000",			// black
		"txt": "#FFFFFF"			// white
	},
	"education": {					// DEV NOTE: not implemented yet
		"label": "",
		"bg": "",
		"txt": ""
	},
	"engine": {
		"label": "App Engine",
		"bg": "#28AFB0",			// turquoise
		"txt": "#000000"			// black
	},
	"garden": {
		"label": "Garden",
		"bg": "#0FA954",			// green
		"txt": "#FFFFFF"			// white
	},
	"gui": {
		"label": "GUI",
		"bg": "#AA78A6",			// light purple
		"txt": "#070707"			// rich black
	},
	"home": {						// DEV NOTE: not implemented yet
		"label": "",
		"bg": "",
		"txt": ""
	},
	"library": {					// DEV NOTE: not implemented yet
		"label": "",
		"bg": "",
		"txt": ""
	},
	"loader": {
		"label": "Loader",
		"bg": "#F0B800",			// yellow
		"txt": "#000000"			// black
	},
	"logger": {
		"label": "Logger",
		"bg": "#6B0F1A",			// crimson
		"txt": "#FFFFFF"			// white
	},
	"menu": {
		"label": "SOLACE Menu",
		"bg": "#502F4C",			// purple
		"txt": "#FFDDD2"			// silk
	},
	"network": {					// DEV NOTE: not implemented yet
		"label": "",
		"bg": "",
		"txt": ""
	},
	"router": {
		"label": "Router",
		"bg": "#4C1C00",			// brown			
		"txt": "#FFFFFF"			// white
	},
	"session": {
		"label": "Session",			
		"bg": "#0d2E83",			// blue
		"txt": "white"
	},	
	"solace": {
		"label": "SOLACE",
		"bg": "#0634AA",			// blue
		"txt": "#FFFFFF"			// white
	},
	"storage": {
		"label": "Storage",			
		"bg": "#EE7674",			// light coral
		"txt": "black"
	},
	"ui": {
		"label": "UI",
		"bg": "#AA78A6",			// light purple
		"txt": "#070707"			// rich black
	},
	"view": {
		"label": "Viewport",
		"bg": "#4E4E0C",			// olive green(ish)
		"txt": "white"
	}
};

// Write colored console log messages
// accepts 2 arguments: message and type (optional)
// using type 'obj' or 'object' allows you to pass custom objects instead of strings
function log(msg,t=null) {
	// if there is no message, show an error
	if (!msg) { console.error(`You didn't pass a message to the log function!`); return false; }
	// special exception for type = 'view' (outputs viewport dimensions: no message required)
	if (msg === 'view') { msg = ''; t='view';}
	// if the verbose flag is set,	
	if (verbose) {

		// figure out what 'type' is and write message to console
		switch(t) {	
			case 'action':
			  console.log(`%c${tags.action.label}:%c `+msg,`background-color:${tags.action.bg};color:${tags.action.txt};padding:2px;`,`color:white;`);
			  break;
			case 'api':
			  console.log(`%c${tags.api.label}:%c `+msg,`background-color:${tags.api.bg};color:${tags.api.txt};padding:2px;`,`color:white;`);			
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
			  console.log(`%c${tags.dev.label}:%c `+msg,`background-color:${tags.dev.bg};color:${tags.dev.txt};padding:2px;`,`color:white;`);			
			  break;			  
			case 'engine':
			  console.log(`%c${tags.engine.label}:%c `+msg,`background-color:${tags.engine.bg};color:${tags.engine.txt};padding:2px;`,`color:white;`);
			  break;			
			case 'error':
			  console.error(msg); // default console error styling
			  break;			  
			case 'garden':
			  console.log(`%c${tags.garden.label}:%c `+msg,`background-color:${tags.garden.bg};color:${tags.garden.txt};padding:2px;`,`color:white;`);
			  break;
			case 'gui':	// alias of 'ui'
			  console.log(`%c${tags.gui.label}:%c `+msg,`background-color:${tags.gui.bg};color:${tags.gui.txt};padding:2px;`,`color:white;`);
			  break;			  
			case 'loader':
			  console.log(`%c${tags.loader.label}:%c `+msg,`background-color:${tags.loader.bg};color:${tags.loader.txt};padding:2px;`,`color:white;`);
			  break;
			case 'logger':
			  console.log(`%c${tags.logger.label}:%c `+msg,`background-color:${tags.logger.bg};color:${tags.logger.txt};padding:2px;`,`color:white;`);
			  break;
			case 'menu':
			  console.log(`%c${tags.menu.label}:%c `+msg,`background-color:${tags.menu.bg};color:${tags.menu.txt};padding:2px;`,`color:white;`);
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
			  console.log(`%c${tags.router.label}:%c `+msg,`background-color:${tags.router.bg};color:${tags.router.txt};padding:2px;`,`color:white;`);
			  break;
			case 'session':
				console.log(`%c${tags.session.label}:%c `+msg,`background-color:${tags.session.bg};color:${tags.session.txt};padding:2px;`,`color:white;`);
				break;			  
			case 'solace':
			  console.log(`%c${tags.solace.label}:%c `+msg,`background-color:${tags.solace.bg};color:${tags.solace.txt};padding:2px;`,`color:white;`);
			  break;
			case 'storage':
			  console.log(`%c${tags.storage.label}:%c `+msg,`background-color:${tags.storage.bg};color:${tags.storage.txt};padding:2px;`,`color:white;`);
			  break;			  
			case 'ui':  // user interface
			  console.log(`%c${tags.ui.label}:%c `+msg,`background-color:${tags.ui.bg};color:${tags.ui.txt};padding:2px;`,`color:white;`);
			  break;
			case 'view': // show viewport width x height (in pixels) - label is 'UI'
			  console.log(`%c${tags.view.label}:%c ${window.innerWidth} px wide x ${window.innerHeight} px high`,`background-color:${tags.view.bg};color:${tags.view.txt};padding:2px;`,`color:white;`);
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
			  if (isObject(msg)){ console.error(`Invalid log type request: expected string`); return false; }
			  // if msg is a string, and we have no type, log to console with no styling
			  else { console.log(msg); }
		}
		return true;
	}
	// if verbose is false, return false for log requests
	else { return false; }
}

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

// always go through main log function... 
// don't call this printObjMsg function directly!
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

// Verbosity level
if (verbose) { 
	// inform the user that verbose logging is enabled
	log('logger.js loaded','loader');
	log('verbose logging enabled','logger');
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

