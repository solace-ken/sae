// ---------------------------------------------------
// functions.js --  shared Javascript functions 
// ---------------------------------------------------

// ---------------------------------------------------
// GLOBAL VARIABLES (used by multiple scripts)
// ---------------------------------------------------

    // devmode
    var devmode = false;

    // timeout delay (in milliseconds)
    // speed up or slow down time between sequences
    const delay = 700;	

// ---------------------------------------------------

// Generate timestamp in JSON (ISO) format
function tstamp() {
	const d = new Date();
	let ts = d.toJSON();	// JSON formatted date
	return ts;
}

// Generate pseudo-random tokens using letters and numbers
// most functions use a 32 digit long token (specified via 'lenth' parameter)
function generateToken(length){
    // allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

// Generate a random number between min and max (inclusive)
function getRandNum(min,max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Add a new CSS file to document <head>
// Accepts 1 argument: CSS file (full path)
function addCSS(cssfile){
	 var head = document.getElementsByTagName('head')[0];
	 var style = document.createElement('link');
	 style.href = cssfile;
	 style.type = 'text/css';
	 style.rel = 'stylesheet';
	 head.append(style);
}

// Load data from a JSON file - async function
// accepts 2 arguments: filename (required) and callback (optional)
async function loadJSON(fname, cback=null) {	
  // if we have no file name, show an error
  if (!fname) { log('JSON file name is required!','error'); return false; }
  // logging
	log(`Loading JSON data from file: ${fname}`,'engine');
	// wait for it...
	let data = await getJSONPromise(fname);
  // if we have data...
	if (data) { 
    log('JSON data loaded successfully','engine'); 
    //console.log('Object is: ', data);
    // do more stuff...
    if (cback) { cback(data); }
  }
} 

// JSON file fetcher - Get Promise 
// called from various async functions to load JSON files
function getJSONPromise(fname){
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
			console.error('Problem fetching file: %c' + error.message, 'color:yellow');
		});
	});
}

// ISO Date string parser
// Accepts 1 argument: ISO date string (e.g. JSON Date)
// Returns: Javascript date object 
function isoStringToDate(isoString) {
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

// Calculate time difference between 2 dates
// expects 2 parameters: old date and new date (JS date objects)
// returns: time difference (in minutes)
function diffDatesInMins(firstdate,seconddate){
	let diff = seconddate.getMinutes() - firstdate.getMinutes();
	if (diff < 1) { diff = 1; } // if it's less than 1, set it to 1
	return diff;
}	

// DEV USE: 
// NOT CURRENTLY USED
// Timestamp age: returns age of timestamp (in hours)
/* function timestampAge(timestamp) {
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


// Replace all given words in a template
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

// truncate text after x chars...
function truncateText(text, length) {
  if (text.length <= length) {
    return text;
  }
  return text.substr(0, length) + '\u2026' // ...
}

// Check for objectivity: 
// returns true if 'obj' is an object
function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

// Check if an object is empty
// returns true or false
function isEmpty(obj) {
   for (var x in obj) { if (obj.hasOwnProperty(x))  return false; }
   return true;
}

// Tests if number is a positive integer
function isPositiveInteger(v) {
  var i;
  return v && (i = parseInt(v)) && i > 0 && (i === v || ''+i === v);
}

// load HTML template (assumes data is stored inside <template> tags)
// accepts 1 argument: template id
// returns innerHTML of requested template
function loadTemplate(templateid) {
	if (!templateid) { console.error('There is no template id to load'); return false; }
	let tpl = document.getElementById(templateid);
	if (tpl) { return tpl.innerHTML; }
	else { console.error('Template data could not be loaded'); return false; }
}

// loadURLs in top window
function loadURL(url) {
	//console.log('URL is: ' + url);
	let furl = 'https://' + url;
	let nwin = window.open(furl);
	nwin.focus();
}

// clear hashes in the URL
// used by SOLACE Menu button 
function clearHashTags() {
	history.replaceState({}, document.title, ".")	
}

// -----------------------------------------------------
// DEV USE: placeholder function for links and buttons
// -----------------------------------------------------
function notYet() {
	var m = 'This feature is not implemented yet';
	alert(m);
	console.log(m);
	return false;
}
// -----------------------------------------------------

// no styling because logger.js isn't loaded yet...
console.log('functions.js loaded');