// --------------------------------------------------------
// STORAGE FUNCTIONS: READ/WRITE TO LOCAL STORAGE
// --------------------------------------------------------

import { 
	aekey, 
	cappkey, 
	lappkey, 
	datakey, 
	infokey,
	targdiv 
} from '/sae/lib/js/modules/variables.js';
import { isObject, generateToken } from '/sae/lib/js/modules/functions.js';
import { log } from "/sae/lib/js/modules/logger.js";
import { getSessionCode } from "/sae/lib/js/modules/session.js";

// ----------------------------------------------------------
// MAIN FUNCTIONS
// ----------------------------------------------------------

// GET SAVED: retrieve values from localstorage (read-only)
// accepts 1 argument: GET object (containing valid data)
// returns true or false
//
// Sample get objects: 
//
// { "type":"data", "key":"value" }
// { "type":"info", "key":"value" }
//
// if no key is requested, function will parse and return the entire
// object. otherwise, it returns only the requested key value
export function getSaved(gobj) {
	// if we have an object,
	if (isObject(gobj)) {
		// if the object contains a 'type' key
		if (gobj.type) {
			// TYPE = INFO
			if (gobj.type === 'info') {
				// try to get the saved info
				var sinfo = localStorage.getItem(infokey);
				// if we have saved info
				if (sinfo) { 
					// parse the object
					var pobj = JSON.parse(sinfo);
					// if we have a key request, only return key value
					if (gobj.key) {	
						// cycle through parsed object, 
						for (let k in pobj) { 
							// if key matches, 
							if (k === gobj.key) { 
								// return the requested key
								return pobj[k]; 
							} 
							// no match: break one iteration of the loop and keep searching
							else { continue; }
						}
						// we have no match
						// log(`storage.js reports: "There is no info key named '${gobj.key}'"`,'storage'); 
						return false;
					}
					// no specific key request? ==> return entire object
					else { return pobj; }
				}
			}
			// TYPE = DATA
			if (gobj.type === 'data') {
				// try to get the saved data
				var sdata = localStorage.getItem(datakey);
				// if we have saved data
				if (sdata) { 
					// parse the object
					var pobj = JSON.parse(sdata);
					// if we have a key, only return requestested value key
					if (gobj.key) {	
						// TODO: add support for returning specific keys
						// console.log('Key search not implemented yet');
						//
						// cycle through object, 
						for (let k in pobj) { 
							// if key matches, 
							if (k === gobj.key) { 
								// return the requested key
								return pobj[k]; 
							} 
							// no match: break one iteration of the loop and keep searching
							else { continue; }
						}
						// we have no match
						//log(`storage.js reports: "There is no data key named '${gobj.key}'"`,'storage'); 
						return false;
					}
					// no specific key request? ==> return entire object
					else { return pobj; }
				}		
			}
		}
		// no 'type' key...
		else {
			// default to type = 'data'
			gobj.type = 'data';
			// try to get saved data
			var sdata = localStorage.getItem(datakey);
			// if we have saved data
			if (sdata) { 
				// parse the object
				var pobj = JSON.parse(sdata);
				// if we have a key request, only return key value
				if (gobj.key) {	
						// cycle through parsed object, 
						for (let k in pobj) { 
							// if key matches, 
							if (k === gobj.key) { 
								// return the requested key
								return pobj[k]; 
							} 
							// no match: break one iteration of the loop and keep searching
							else { continue; }
						}
						// we have no match
						// log(`storage.js reports: "There is no data key named '${gobj.key}'"`,'error'); 
						return false;
				}
				// no specific key request? ==> return entire object
				else { return pobj; }
			}
			// no saved data
			else { return false; }
		}
	}
	// no valid object
	else {
		log('You did not pass a valid object to the getSaved() function', 'error');
		log(`String values are not permitted. You have to pass a 'get object' containing valid data.`,'error');
	}
}

// SET SAVED: create or modify values in localstorage
// accepts 1 argument: SAVE object (containing valid data)
// returns true or false
//
// example 1: { "type":"data","key":"value" }
// example 2: { "type":"info","key":"value" }
// example 3: { "key": "value" } 
//
// example 3 defaults to type = 'data'
// if 'type' isn't specified, it defaults to 'data'
//
export function setSaved(sobj) {
	// if object is empty, or not an object, show an error
	if ((!sobj) || (!isObject(sobj))) { 
		log(`storage.js reports: "function setSaved() received an invalid object"`,'error'); 
		return false; 
	}
	// we have a 'save object'!
	else {
		// check if we have a type
		if (sobj.type) {
			// figure out if type is valid...
			switch (sobj.type) {
				case 'data':
				  // if we have existing data, merge with new data
				  if (checkForSaved('data')) { modifySaved(sobj); }
				  // if we don't have data, create it
				  else { localStorage.setItem(datakey, JSON.stringify(sobj)) }
				  break;
				case 'info':
				  // if we have existing info, merge with new info
				  if (checkForSaved('info')) { modifySaved(sobj); }
				  // if we don't have info, create it
				  else { localStorage.setItem(infokey, JSON.stringify(sobj)) }				  
				  break;
				default: 
				  log(`Invalid save object type: "${sobj.type}"`,'error');
				  log(`Valid type options are: 'info' or 'data'`,'yellow');
				  return false;
			}
			return true;
		}
		// no type was passed...
		// default to type = 'data'
		else {
			// set type to 'data'
			sobj.type = 'data';
			// check for existing data... and modify it
			if (checkForSaved('data')) { modifySaved(sobj); }
			// no existing data
			else {
				// write to localstorage
				localStorage.setItem(datakey, JSON.stringify(sobj));
				return true;
			}

		}		
	}
}

// DELETE SAVED: delete saved info and data
// accepts 2 arguments: key to delete and type of storage (info or data)
// if type is not given, then the function will default to type = 'data'
// returns true or false
export function deleteSaved(key, type=null) {
	// if there is no key, show an error
	if (!key) { 
		log(`storage.js reports: "function deleteSaved() requires a key to be deleted"`,'error'); 
		return false; 
	}
	// SYSTEM KEYS: array of keys which can't be deleted
	const blocked = [
		'viewport',
		'online',
		'platform',
		'agent',
		'firstrun',
		'handoff',
		'handback',
		'msg',
		'type'
	];
	// if the user is trying to delete one of the blocked keys,
	if (blocked.includes(key)) {
		// show an error
		log(`storage.js reports: "Internal system keys (like '${key}') can't be deleted"`,'error'); 
	 	return false;
	}	
	// if we have a storage type
	if (type) {
		// type = INFO:
		if (type === 'info') {
			// try to get localstorage info
			let lsi = getSaved({"type":"info"});
			// if we have no info, show an error
			if (!lsi) {
				log(`storage.js reports: "There is no saved info in localstorage"`,'error'); 
				return false;
			}
			// we have data...
			else {
				// cycle through object, 
				for (let k in lsi) { 
					// if key matches, 
					if (k === key) { 
						// delete the requested key
						delete lsi[k]; 
						// update localStorage
						localStorage.setItem(infokey,JSON.stringify(lsi));
						return true;
					} 
					// no match: break one iteration of the loop and keep searching
					else { continue; }
				}
				// if we have no match at all, show an error
				log(`storage.js reports: "There is no info key named '${key}' to delete"`,'error'); 
				return false;
			}
		}
		// type = DATA
		if (type === 'data') {
			// try to get localstorage data
			let lsd = getSaved({"type":"data"});
			// if we have no data, show an error
			if (!lsd) {
				log(`storage.js reports: "There is no saved data to delete"`,'error'); 
				return false;
			}
			// we have data...
			else {
				// cycle through object, 
				for (let k in lsd) { 
					// if key matches, 
					if (k === key) { 
						// delete the requested key
						delete lsd[k]; 
						// update localStorage
						localStorage.setItem(datakey,JSON.stringify(lsd));
						return true;
					} 
					// no match: break one iteration of the loop and keep searching
					else { continue; }
				}
				// if we have no match at all, show an error
				log(`storage.js reports: "There is no data key named '${key}'"`,'error'); 
				return false;
			}
		}	
	}		
	// no 'save object' type
	// default to type = 'data'
	else {
		// try to get localstorage datakey
		let lsd = getSaved({"type":"data"});
		// if we have no data, show an error
		if (!lsd) {
			log(`storage.js reports: "There is no saved data in localstorage"`,'error'); 
			return false;
		}
		// we have data...
		else {
			// cycle through object, 
			for (let k in lsd) { 
				// if key matches, 
				if (k === key) { 
					// delete the requested key
					delete lsd[k]; 
					// update localStorage
					localStorage.setItem(datakey,JSON.stringify(lsd));
					return true;
				} 
				// no match: break one iteration of the loop and keep searching
				else { continue; }
			}
			// if we have no match at all, show an error
			log(`storage.js reports: "There is no data key named '${key}' to delete"`,'error'); 
			return false;
		}		
	}
}

// ----------------------------------------------------------
// SUPPORTING FUNCTIONS
// ----------------------------------------------------------

// modify saved info or data
// accepts 1 argument: save object
// returns true or false
function modifySaved(sobj) {
	// if there is no save object, show an error
	if (!sobj) { 
		log(`storage.js reports: "function modifySaved() did not receive a valid object"`,'error');
		return false;
	} 
	// use saved object type
	let oldsaved = getSaved({"type":sobj.type});
	// 
	// DEV NOTE: no need to parse, because getSaved() returns an object
    //
	// if we can't retrieve data, show an error
	if (!oldsaved) { 
		log(`storage.js reports: "function setSaved() could not retrieve data from localstorage"`,'error');
		return false;
	}
	// if we have an object...
	else {
		// create a new object and merge new data with existing data
		let newsaved = Object.assign(oldsaved, sobj);
		// write new values to localStorage
		if (sobj.type === 'data') { localStorage.setItem(datakey, JSON.stringify(newsaved)); return true; }
		if (sobj.type === 'info') { localStorage.setItem(infokey, JSON.stringify(newsaved)); return true; }
		// if we don't have a valid type, return false
		return false;
	}	
}

// check localstorage to see if saved data/info exists (datakey & infokey) 
// accepts 1 argument: type 
// valid type options are: 'info' or 'data'
// if no argument is given, type will default to 'data'
//
// example 1: checkForSaved('info'); type = 'info'
// example 2: checkForSave('data'); type = 'data'
// example 3: checkForSaved(); <--- no argument provided. type = 'data'
//
export function checkForSaved(type) {
	// create empty 'get object' var
	var gobj;
	// NO TYPE = DATA (default)
	if (!type) { gobj = {"type":"data"}; }
	// TYPE: INFO
	if (type === 'info') { gobj = {"type":"info"}; }
	// TYPE: DATA
	if (type === 'data') { gobj = {"type":"data"}; }
	// try to get saved data or info
	let sdata = getSaved(gobj);
	// if it exists, return true
	if (sdata) { return true; }
	// otherwise, return false
	else { return false; }
}

// initialize storage (both info and data keys)
export function initializeStorage() {
	setSaved({"type":"data","msg":""});
	setSaved({"type":"info"});
}

// save device info
export function saveDeviceInfo() {
	// if we're on Chrome, get userAgentData
	if(navigator.userAgentData) {
		navigator.userAgentData.getHighEntropyValues(["architecture","platform","mobile"])
		.then((data) => { 
			// format the platform and architecture info
			let platform = data.platform +' '+ data.architecture;
			// create an info object
			const sido = {
				"type": "info",
				"device": [
					{
						"nickname": "",
						"viewport": { "width":window.innerWidth, "height":window.innerHeight },
						"mobile": data.mobile,
						"online": navigator.onLine,
						"platform": platform,
						"agent": navigator.userAgent,
						"ip": "127.0.0.1",
						"token": getSessionCode()
					}
				]
			};
			setSaved(sido);		
		});
	} 
	// otherwise try 'navigator.platform' value 
	// TODO: figure out of there's a 'mobile' value on Firefox like in Chrome
	// else {
	// 	// create an object
	// 	let nobj = generateNewInfoObj({"platform":navigator.platform});
	// 	// stringify, save to localStorage, and return the object
	// 	//localStorage.setItem(infokey, JSON.stringify(nobj));
	// }	
}

// save target div data
// saves the current target div to localstorage
// default targdiv is 'ui' and is stored in module variables.js
export function saveTargDiv() {
	// if we have a targdiv value
	if (targdiv) {
		// create a new object
		let tdo = {"type":"data","targdiv": targdiv};
		// and save to localstorage
		setSaved(tdo);
	}
}

// Get SAE Metadata
// returns meta-data object, or false
export function getSaeMetaData() {
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
export function createSaeMetaData(data) {
	// create new SAE object
	const sae = {	
	  "name": data.name,
	  "version": data.version,
	  "subversion": data.subversion,
	  "releasedate": data.releasedate,
	  "author": data.author,
	  "brand": data.brand,
	  "key": data.key,
	  "logo": data.logo,
	  "icon": data.icon,
	  "site": data.site,
	  "support": data.support,
	  "code": getSessionCode()
  };
  // save to localStorage
  let svd = localStorage.setItem(aekey, JSON.stringify(sae));
  // if it worked, return true
  if (svd) { return true; }
}

// TODO: where is current app?

// get Last Used App
export function getLastApp(lappkey) {
	var lapp = sessionStorage.getItem(lappkey);
	if (!lapp) { return false; }
	var pval = JSON.parse(lapp);
	return pval;
}

// update localStorage for last and current apps
export function updateLastCurrent(lastapp,currentapp) {
	if ((!lastapp)||(!currentapp)) { console.error('Syntax: updateLastCurrent(lastapp,currentapp)'); return false; }
	// update current app
	localStorage.setItem(cappkey, currentapp);
	// update last app
	localStorage.setItem(lappkey, lastapp);
}

// ----------------------------------------------------------
// STORAGE CHECK FUNCTIONS
// ----------------------------------------------------------

// check for device storge 
// returns true or false
export function checkForStorage(){
	let ls = storageAvailable('localStorage');
	let ss = storageAvailable('sessionStorage');
	// storage available
	if ((ls)&&(ss)) { return true; }
	// no storage
	else { return false; }
}

// is storage available?
// test device storage by writing to it
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

// -------------------------------------------
// DEV USE
// -------------------------------------------

// check if developer mode is enabled
// TODO: move this to saved object (sobj) instead
// returns true or false
export function checkDevmode() {
	let dmc = localStorage.getItem('devmode');
	if (dmc) { return true; }
	else { return false; }
}

// DEV USE: Custom Storage Keys
// TODO: add custom storage keys

// New Custom Storage Key - not used yet
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