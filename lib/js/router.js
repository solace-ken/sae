// -------------------------------------------------------------------------
// router.js - a common method to load page templates
//
// DEV NOTE: this is a stand-alone script
//
// * don't convert to a module 
// * don't use import/export statements
// * do not try to read or write from 
// 
// Use 'rLog()' (router logger) or 'console.log()' for logging
//
// Don't call 'log()' function from logger.js
//
// To work properly, this script needs to be loaded in the <head>
// of the document so page elements have access to all functions
// 
// -------------------------------------------------------------------------

// TODO: wrap the localstorage calls here in a check for storage call first!
// TODO: this document loads in Doc head and starts making localStorage calls
// TODO: what happens when storage is disabled or full? Need to limit storage calls

// router version:
const routver = '1.2.8 alpha';

// array of keywords to look for if user doesn't specify 
// a default target ID in the routemap.json file
const nameArr = [
	'main',
	'maincontent',
	'content',
	'view',
	'mainview',
	'viewer',
	'mainviewer',
	'viewport',
	'mainviewport',
	'mainscreen'
];

// TODO: handle URLs as valid input (internal and external)
// route: load correct templates to predefined elements
// accepts 1 argument: request (can be string or object)
function route(req) {
	// if no request is passed, show an error
	if (!req) { 
		console.error(`Empty Route Request!`); 
		return false; 
	}
	// try to grab element ID from 'this' (used on links and buttons)
	var id = req.id;
	// if no element ID... 
	if (!id) { 
		// is it an object? try to route it...
		if (isObject(req)) { loadRouteObj(req); }
		// otherwise, check routemap for string
		else { routeMapLookup(req); }
	}
	// if we have an element id from 'this' value,
	// look up template target in routemap
	else { routeMapLookup(id); }
}

// routemap lookup
// used for elements which pass an id value from 'this'
// looks up the mapping and loads templates
function routeMapLookup(req) {
	// DEV USE:
	// console.log(`Request is: ${req}`);
	// try to get the routemap from localStorage
	let rm = getRouteMap();
	// if there is no routemap,
	if (!rm) { 
		// show an error
		console.error(`There is no routemap in localStorage`);
		// try to load routemap again
		loadRouteMap();
	}
	// create arrays for routemap keys and values
	const keysArr = Object.keys(rm);
	const valsArr = Object.values(rm);	
	// index id - index from keysArr (using id value)
	let ii = keysArr.indexOf(req);
	// if index id doesn't exist (e.g. misspelled id name)
	if (ii < 0) { 
		// show an error and return false
		console.error(`Element id ("${req}") has no matching template`);
		rLog(`Check your routemap.json file (or HTML code) for errors`);
		return false;
	}
	// get template id from valsArr (using index id)
	let tpl = valsArr[ii];
	// DEV USE:
	// console.log('Template is: ' + tpl);
	// if the returned value is an object, 
	// we're loading multiple templates:
	if (isObject(tpl)) {		
		// create new arrays for the object keys and values
		const karr = Object.keys(tpl);
		const varr = Object.values(tpl);
		// cycle through the object keys 
		for (i = 0; i < karr.length; i++) {
			// set page element to be updated
			let pe = document.getElementById(karr[i]);
			// update element with matching template
			pe.innerHTML = loadTemplate(varr[i]);
		}
	}	
	// if the returned value is a string, we're loading a single template
	// Singles are displayed in default target ('deftarg') element defined in routemap
    else { 
		// use default target ('deftarg') value from routemap
		if (rm.deftarg) { 
			let target = document.getElementById(rm.deftarg);
			target.innerHTML = loadTemplate(tpl);  // Update DOM		
		}	
		// if there is no 'deftarg' in routemap
		else { 	
			// try to look for variations of 'main' type tags in the document
			let mtarget = lookForMain();
			// 'mtarget' contains the element most likely to be default target
			// but, it's just a guess based on tag names and could easily be wrong
			mtarget.innerHTML = loadTemplate(tpl);  // Update DOM
		}
	}	
}

// if routemap.json doesn't contain a default target (deftarg)
// check current document for other main-type elements 
function lookForMain() {
	// first, look for a <main> tag (duh!)
	let maintag = document.getElementsByTagName('main');
	// we have a <main> tag! return the element	
	if (maintag.length > 0) { return maintag[0]; }
	// we have no main tag...
	else {
		// cycle through the keywords array
		for (i=0; i < nameArr.length; i++) {
			// test for element ids
			let x = document.getElementById(nameArr[i]);
			// if we have a match, return the element
			if (x) { return(nameArr[i]); }
		}
	}
}

// Get routemap file from localStorage
// returns routemap object, or false
function getRouteMap() {
	// try to retrieve routemap from localStorage
	let rmap = localStorage.getItem('routemap');
	// if there is no routemap, return false
	if (!rmap) { return false; }
	// otherwise, parse and return the object
	if (rmap) { return JSON.parse(rmap); }
}

// Router template loader
// accepts 1 argument: template id
// a stand-alone function, not connected to any
// other template-loading functions in SAE
function loadTemplate(tid) {
	// if there is no template id, show an error
	if (!tid) { console.error('You have to provide a template id to load'); return false; }
	// try getting internal template id
	let itpl = document.getElementById(tid);
	// success! we have a matching template id
	if (itpl) { 	
		// extract HTML from template tags
		let tdata = itpl.innerHTML;
		// return HTML
		return tdata;
	}
	// DEV USE: EXPERIMENTAL! - DO NOT USE THIS METHOD!
	// THIS WILL BE DEPRECATED IN THE FUTURE
	else {
		// console.log(`Using external templates.js file...`);
		// try evaluating and assigning 'id' variable
		// (assumes templates.js file is already loaded)
		let etpl = eval(tid); // DEV NOTE: This is bad practice and should never be done!
		// it worked!? wow. we have a template variable by that name
		// return the data (no need to extract HTML first)
		if (etpl) { return etpl; }
		// otherwise, template could not be loaded, show an error
		else { console.error(`Template data could not be loaded`); return false;  }
	}
}

// STORAGE:
// remove routemap data from localstorage
function removeRouteMap() {
	let rm = localStorage.getItem('routemap');
	if (!rm) { return false; } 
	else { localStorage.removeItem('routemap'); return true; }
}

// ASYNC FUNCTION:
// TODO: switch this to use loadJSON() from functions.js module
// JSON file fetcher -  loads routemap.json file 
// accepts 1 argument: file name (optional)
async function loadRouteMap(fname=null){	
  // if there is no file name, use default
  if (!fname) { fname = 'routemap.json'; }
  rLog(`loading routemap data`);
  // wait for it...
  let data = await getJSONPromise(fname);
  // if we have no data, give an error
  if (!data) { console.error(`JSON file ${fname} returned no data`); return false; }
  // save routemap to localStorage
  localStorage.setItem('routemap', JSON.stringify(data));
  // log status
  rLog(`routemap loaded successfully`);
}

// start the router
// accepts 1 argument: path to routemap.json file
function startRouter(fname=null) {
	// check to see if we have one in localstorage
	let rm = getRouteMap();
	// Routemap exists --> return true
	if (rm) { return true; }
	// No routemap --> load from JSON (async function)
	else { loadRouteMap(fname); }
}

// ------------------------------------------------------------------------------
// Not currently used:
//
// DEV USE: EXPERIMENTAL
//
// load route object :
// load templates directly from route object info (no routemap.json needed)
// accepts 1 argument: route object (a mini routemap)
//
// Some limitations need to be in place for this function: 
//
// 1) user can't try to unload/load routemap.json file (e.g. bypass current navigation)
// 2) user can't replace current ui element (just sub-elements underneath main ui element)
// 3) any logging / data storage that normally happens in a target element still has to occur (user can't bypass logging)
//
function loadRouteObj(obj) {
	// if we don't have a route object, show an error
	if (!obj) { console.error(`There was no route object passed`); return false; }
	// otherwise, the user passed something...
	else {
		// check to make sure it's an object, or show an error
		if (!isObject(obj)) { rLog(`You have to pass an object to this function`); return false; }
		// we have an object!
		else {
			// cycle through the object,
			for (var key in obj) 
			{
				// make sure it's an actual property (not from prototype)
				if (obj.hasOwnProperty(key)) 
				{
					// skip any 'default target' keys
					if (key === 'deftarg') { continue; }
					// try to get the page element 
					let ele = document.getElementById(key);
					// if it doesn't exist, show an error
					if (!ele) { rLog(`The element ${key} does not exist`); return false; }
					// otherwise, load the templates
					else { ele.innerHTML = loadTemplate(obj[key]); }
					// DEV USE:
					//console.log(key + " -> " + obj[key]);
				}
			}
		}	
	}
}

// ------------------------------
// Duplicated functions:
// ------------------------------

// Check for objectivity: 
// returns true if 'obj' is an object
function isObject(obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
}

// JSON File Loader - Get Promise 
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

// Router Log: mini-logger used just by the router
// broken out from logger.js module to avoid dependencies
function rLog(msg) {
	// make sure we have a message
	if (!msg) { console.error('You have to pass a message to the rLog() function'); return false; } 
	else {
		// if we do, show the router log message
		console.log('%cRouter:%c '+ msg,'background:#4C1C00; color: white; padding: 2px;','color:white;');
	}
}

// DEV USE:
// show router version in console
rLog(`version ${routver}`);
		

