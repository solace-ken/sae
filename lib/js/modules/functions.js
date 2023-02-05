// ---------------------------------------------------
// functions.js --  shared Javascript functions 
// ---------------------------------------------------

import { disableback } from "/sae/lib/js/modules/variables.js";
import { log } from "/sae/lib/js/modules/logger.js";
// import { apiver } from "/sae/lib/js/modules/api.js";
import { loadErrorTemplate, showError } from "/sae/lib/js/modules/ui.js";

// disable browser back button
// TODO: make this work with 'devmode', so back button works when devmode = true
// TODO: possibly move to localstorage instead?
// TODO: at least move it inside of a funtion. Something.
if (disableback) {
	history.pushState(null, null, location.href);
	window.onpopstate = function () { history.go(1); };
}

// Generate timestamp in JSON (ISO) format
// returns JSON date (string)
export function tstamp() {
	const d = new Date();
	let ts = d.toJSON();	// JSON formatted date
	return ts;
}

// Generate pseudo-random tokens using letters and numbers
// most functions use a 32 digit long token (specified via 'lenth' parameter)
export function generateToken(length){
    // allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

// Generate a 20 digit code in the format: XXXX-XXXX-XXXX-XXXX-XXXX
// uses only uppercase letters, numbers and dashes
export function generateNewCode() {
  let pt1 = generateToken(4).toUpperCase();
  let pt2 = generateToken(4).toUpperCase();
  let pt3 = generateToken(4).toUpperCase();
  let pt4 = generateToken(4).toUpperCase();
  let pt5 = generateToken(4).toUpperCase()
  let newcode = pt1 +'-'+ pt2 +'-'+ pt3 +'-'+ pt4 +'-'+ pt5;
  return newcode;
} 

// Generate a random number between min and max (inclusive)
export function getRandNum(min,max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// JSON File Loader - Async Function
// Load data from a JSON file
// accepts 2 arguments: filename (required) and callback (optional)
export async function loadJSON(fname, cback=null) {	
  // if we have no file name, show an error
  if (!fname) { log('JSON file name is required!','error'); return false; }
  // logging
  log(`Loading JSON data from file: ${fname}`,'loader');
	// wait for it...
	let data = await getJSONPromise(fname);
  // if we have data...
	if (data) { 
    // do more stuff...
    log('JSON data loaded successfully','loader');
    // if we have a callback function, run it (passing the JSON data)
    if (cback) { cback(data); }
    // otherwise, show JSON data in console
    else {
      // use 'console.log' here because log() doesn't support this feature yet
      // TODO: add support for data objects being show via log()
      console.log('Javascript Object: ', data);
    }
  }
} 

// JSON File Loader - Get Promise 
// called from various async functions to load JSON files
export function getJSONPromise(fname){
	return new Promise(function(resolve,reject){
		fetch(fname)
		.then(function(response) {
		  if (!response.ok) {
			throw new Error("HTTP error, status = " + response.status);
		  }
		  return response.json();
		})
		.then(function(json) {
			resolve(json);	
		})
		.catch(function(error) {	
			console.error(`Problem fetching file: "${fname}"`);
      loadErrorTemplate();
      let nofile = {
        "title": error.message,
        "cause":"The app could not locate the requested JSON file",
        "solution":"Check your spelling and make sure the path is correct"
      };
      showError(nofile);
		});
	});
}

// Dump Localstorage to a JSON file (with .solace extension)
export const dumpStorageToJson = (filename, dataObjToWrite) => {
  log('dumping localStorage data to JSON...','engine');
  const blob = new Blob([JSON.stringify(dataObjToWrite, null, "\t")], { type: "text/json" });
  const link = document.createElement("a");
  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
  const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
  });
  link.dispatchEvent(evt);
  link.remove()
};

// ISO Date string parser
// Accepts 1 argument: ISO date string (e.g. JSON Date)
// Returns: Javascript date object 
export function isoStringToDate(isoString) {
    // Split the string into an array based on the digit groups.
    var dateParts = isoString.split( /\D+/ );
    // Set up a date object with the current time.
    var returnDate = new Date();
    // Manually parse the parts of the string and set each part for the
    // date. Note: Using the UTC versions of these functions is necessary
    // because we're manually adjusting for time zones stored in the
    // string.
    returnDate.setUTCFullYear( parseInt( dateParts[ 0 ] ) );
    // The month numbers are one "off" from what normal humans would expect
    // because January == 0.
    returnDate.setUTCMonth( parseInt( dateParts[ 1 ] - 1 ) );
    returnDate.setUTCDate( parseInt( dateParts[ 2 ] ) );
    // Set the time parts of the date object.
    returnDate.setUTCHours( parseInt( dateParts[ 3 ] ) );
    returnDate.setUTCMinutes( parseInt( dateParts[ 4 ] ) );
    returnDate.setUTCSeconds( parseInt( dateParts[ 5 ] ) );
    returnDate.setUTCMilliseconds( parseInt( dateParts[ 6 ] ) );
    // Track the number of hours we need to adjust the date by based
    // on the timezone.
    var timezoneOffsetHours = 0;
    // If there's a value for either the hours or minutes offset.
    if ( dateParts[ 7 ] || dateParts[ 8 ] ) {
        // Track the number of minutes we need to adjust the date by
        // based on the timezone.
        var timezoneOffsetMinutes = 0;
        // If there's a value for the minutes offset.
        if ( dateParts[ 8 ] ) {
            // Convert the minutes value into an hours value.
            timezoneOffsetMinutes = parseInt( dateParts[ 8 ] ) / 60;
        }
        // Add the hours and minutes values to get the total offset in
        // hours.
        timezoneOffsetHours = parseInt( dateParts[ 7 ] ) + timezoneOffsetMinutes;
        // If the sign for the timezone is a plus to indicate the
        // timezone is ahead of UTC time.
        if ( isoString.substr( -6, 1 ) == "+" ) {
            // Make the offset negative since the hours will need to be
            // subtracted from the date.
            timezoneOffsetHours *= -1;
        }
    }
    // Get the current hours for the date and add the offset to get the
    // correct time adjusted for timezone.
    returnDate.setHours( returnDate.getHours() + timezoneOffsetHours );
    // Return the Date object calculated from the string.
    return returnDate;
}

// Calculate difference between 2 dates in MINUTES
// expects 2 parameters: old date and new date (JS date objects)
// returns: time difference (in minutes)
export function diffDatesInMins(firstdate,seconddate) {
	let diff = seconddate.getMinutes() - firstdate.getMinutes();
	if (diff < 1) { diff = 1; } // if it's less than 1, set it to 1
	return diff;
}

// Calculate difference between 2 dates in SECONDS
// expects 2 parameters: old date and new date (JS date objects)
// returns: time difference (in seconds)
export function diffDatesInSecs(firstdate,seconddate) {
	let diff = seconddate.getSeconds() - firstdate.getSeconds();
	if (diff < 1) { diff = 1; } // if it's less than 1, set it to 1
	return diff;
}

// truncate text after x chars...
export function truncateText(text, length) {
  if (text.length <= length) {
    return text;
  }
  return text.substr(0, length) + '\u2026' // ...
}

// Check for objectivity: 
// returns true if 'obj' is an object
export function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

// Check if an object is empty
// returns true or false
export function isEmpty(obj) {
   for (var x in obj) { if (obj.hasOwnProperty(x))  return false; }
   return true;
}

// Tests if number is a positive integer
export function isPositiveInteger(v) {
  var i;
  return v && (i = parseInt(v)) && i > 0 && (i === v || ''+i === v);
}

// Not Yet: a placeholder function for links and buttons
// informs the user that the feature isn't implemented yet
export function notYet() {
	var m = 'This feature is not implemented yet';
	console.log(m);
  alert(m); 
	return false;
}

// -----------------------------------------------------
// DEV USE: NOT CURRENTLY USED
// -----------------------------------------------------
//
// Timestamp age: returns age of timestamp (in hours)
/* 
function timestampAge(timestamp) {
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
		console.log('Refreshing session with current token');
		//createMetaData(app.token);
		return true;
	}
	// if timestamp is not 12 hours old, keep using it
	else { return true; }		
}

// Replace all given words in a template (via an object)
// 2 arguments: string, mapObject
// returns: new string with replaced words
// Example: 
// const mapObj = { firstname:"Bill", lastname:"Jones", age:"25" };
// const oldTemplate = document.getElementById('template').innerHTML;
// const newTemplate = replaceAll(oldTemplate, mapObj);
function replaceAll(str,mapObj){
	var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
	return str.replace(re, function(matched){
		return mapObj[matched.toLowerCase()];
	});
}
 */

// -----------------------------------------------------
// DEV USE:
// -----------------------------------------------------

// const startapp = '';		// User pref for app to autostart

// TODO: this is the stub for 'show boot messages one time'
//

export function showSuccessMsg() {

  log(`showSuccessMsg() reached`,'dev');
  return true;

  /* console.log('variables.js loaded');
  console.log('functions.js loaded');
  console.log('logger.js loaded');
  console.log('router.js loaded');
  console.log('storage.js loaded');
  console.log('session.js loaded');
  console.log('ui.js loaded');
  console.log('api.js loaded');
  if (apiver) { console.log('API version: ' + apiver); }
  console.log('main.js loaded');
  console.log('logger_tags.json loaded');
  console.log('metadata.json loaded'); */

}