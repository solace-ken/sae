// --------------------------------------------------------
// STORAGE FUNCTIONS: READ/WRITE TO LOCAL STORAGE
// --------------------------------------------------------

import { 
	aekey, 
	cappkey, 
	lappkey, 
	datakey, 
	infokey 
} from '/sae/lib/js/modules/variables.js';
import { isObject, generateToken } from '/sae/lib/js/modules/functions.js';
import { log } from "/sae/lib/js/modules/logger.js";

// get SAE metadata
// returns either metadata object, or false
export function getMetaData() {
	let md = localStorage.getItem(aekey);
	// If it doesn't exist, return false
	if (!md) { return false; }
	else {
		// parse it and return object 
		let data = JSON.parse(md);
		return data
	}	
}

// check localstorage for saved (data or info)
// accepts 1 argument: get object type 
// valid options are: 'info' or 'data'
// returns true or false
// DEV NOTE: this does not search for data or check for other saved keys!
// DEV NOTE: it just returns true if the 'type' key exists, and false if it doesn't
//
export function checkForSaved(gotype) {
	// create get object var
	var gobj;
	// if we don't have a type, set var to 'data'
	if (!gotype) {
		gobj = {"type":"data"};
	}
	// type = info
	if (gotype === 'info') {
		gobj = {"type":"info"};
	}
	// type = data
	if (gotype === 'data') {
		gobj = {"type":"data"};
	}
	// try to get saved data or info
	let sdata = getSaved(gobj);
	// if it exists, return true
	if (sdata) { return true; }
	// otherwise, return false
	else { return false; }
}

// Get saved data or info
// accepts 1 argument: get object 
// the get object contains type and key requests
//
// Sample get object: { "type":"data", "key":"value" }
//
// getSaved() is a regetSavedad-only function
//
// if no specific key is requested, function will parse and return the entire
// object (data or info). otherwise, it returns only the requested key value
export function getSaved(gobj) {
	// if we have an actual object,
	if (isObject(gobj)) {
		// and, if the get object contains a 'type' request
		if (gobj.type) {
			// if the type request is 'info'
			if (gobj.type === 'info') {
				log('We have an info request','storage');
				// get saved info from localStorage
				var sinfo = localStorage.getItem(infokey);
				// if we have saved info...
				if (sinfo) { 
					// parse object
					var pobj = JSON.parse(sinfo);
					// if we have a key, only return value key
					if (gobj.key) {	
						// create empty value
						let val;
						// run obj.key through switch
						switch(gobj.key) {
							case 'viewport':
							  val = pobj.v;			// viewport dimensions
							  break;
							case 'online':
							  val = pobj.online;	// online status
							  break;
							case 'platform':
							  val = pobj.platform; 	// platform data
							  break;
							case 'agent':
							  val = pobj.agent;		// user agent data
							  break;
							case 'firstrun':
							  val = pobj.firstrun;	// first-run flag
							  break;
							case 'handoff':
							  val = pobj.handoff;	// hand-off timestamp
							  break;
							case 'handback':		
							  val = pobj.handback;	// hand-back timestamp
							  break;
							case 'msg':
							  val = pobj.msg;   	// temp messages
							  break;
							default: 
							  val = null;
						}
						// return the value
						return val;
					}
					else { return pobj; } // no specific key request? ==> return entire object
				}
				// no saved info? ==> return false
				else { return false; }
			}
			// if the type request is 'data'
			if (gobj.type === 'data') {

				log('We have a data request','storage');

				// get saved info key from localStorage
				var sdata = localStorage.getItem(datakey);

				// if we have saved data...
				if (sdata) { 

					// parse the object
					var pobj = JSON.parse(sdata);

					// if we have a key, only return requestested value key
					if (gobj.key) {	

						// create empty value
						let val;
						// run obj.key through switch
						switch(gobj.key) {
							case 'viewport':
							val = pobj.v;			// viewport dimensions
							break;
							case 'online':
							val = pobj.online;		// online status
							break;							
							case 'current':
						    val = pobj.current;		// current app
							break;
							case 'platform':
							val = pobj.platform; 	// platform data
							break;
							case 'agent':
							val = pobj.agent;		// user agent data
							break;
							case 'firstrun':
							val = pobj.firstrun;	// first-run flag
							break;
							case 'handoff':
							val = pobj.handoff;		// hand-off timestamp
							break;
							case 'handback':		
							val = pobj.handback;	// hand-back timestamp
							break;
							case 'msg':
							val = pobj.msg;   		// temp messages
							break;
							default: 
							val = null;
						}
						// return the value
						return val;
					}
					else { return pobj; } // no specific key request? ==> return entire object
				}

				// no saved info? ==> return false
				else { 
					if (gobj.key) { log(`We have no saved data for key: "${gobj.key}"`,'storage'); }
					else { log('No saved data','storage'); }
					return false; 
				}				
			}

		}
		else {
			log('You did not pass an object containing a valid type to the getSaved() function', 'error');
			log(`Valid types are: "data" and "info". Please check your object values and try again.`,'error');		
		}
	}
	// we do not have a get object
	else {
		log('You did not pass a valid object to the getSaved() function', 'error');
		log(`String values are not permitted. You have to pass a 'get object' containing valid data.`,'error');
	}
}

// Set is the only way to edit data in localStorage
// If you want to get read-only data, use "getSaved()"
// If you want to write data to storage use "setSaved()"
// 
// expects a 'save object' containing valid data
// the smallest possible valid objects are:
//
// {"type":"data"}
// {"type":"info"}
//
// can be used to create new data/info or, update existing keps
//
export function setSaved(sobj) {	

	// if save object is empty, or not really an object, show an error
	if ((!sobj) || (!isObject(sobj))) { log('The setSaved() function says: "no valid save object received".','error'); log('Nothing was saved to localStorage','storage'); return false; }

	// otherwise, do stuff...
	else {
		
		// check to make sure we have a 'save object' type
		if (sobj.type) {

			// check to see if type is valid (info or data)
			if ((sobj.type === 'info') || (sobj.type === 'data')) {

				// write info to localStorage
				if (sobj.type === 'info') {
					localStorage.setItem(infokey, JSON.stringify(sobj));
					return true;
				}

				// write data to localStorage
				if (sobj.type === 'data') {
					localStorage.setItem(datakey, JSON.stringify(sobj));
					return true;
				}

			}

			// it's not valid, show an error
			else {

				log(`Invalid save object type: "${sobj.type}"`,'error');
				log('Nothing was saved to localStorage','storage');
				return false;
			
			}
		}

		// no 'save object' type
		else {
			log('We do not have a valid save object','error');
			return false;
		}
	}

	//const sk =  localStorage.getItem();

	//console.log(datakey);

	// if it fails, we probably don't have a key yet
	// but, what type of key is it? info or data?
	/* if (!sdk) { 

		// logging
		log('Saved key does not exist.','storage'); 

		log('Trying to create it','storage');

		//log('Trying to create it','dev');
		// try to create it
		//generateNewSaved({"type":"data"});
		// and call the function again
		//setSaved(newdata);
	}
	else {
		// parse saved-data
		const pdata = JSON.parse(sdk);
		// create a new object and merge newdata with existing saved-data
		let newobject = Object.assign(pdata, newdata);
		// write new values to localStorage
		localStorage.setItem(datakey, JSON.stringify(newobject));
		return true;
	} */


}

// delete saved-data key
// accepts 1 argument: key (required)
export function deleteSaved(key) {
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
			localStorage.setItem(datakey,JSON.stringify(sd));
			return true;
		} 
	}
	// if there is no match, show error
	if (!match) {
		console.error(`deleteSaved: Key "${key}" does not exist`);
		return false;
	}	
}

// generate a new saved object 
// accepts 1 argument: save object 
//
// an object containing type, key, and values to save
// example: { "type":"data","key":"foo","value":"bar" }
// valid types are: data and info
//
export function generateNewSaved(sobj) {
	// if we have an actual object,
	if (isObject(sobj)) {
		// if the object contains a 'type' request
		if (sobj.type) {

			// info request
			if (sobj.type === 'info') {
				// if saved info key already exists, do nothing
				if (localStorage.getItem(infokey)) { return false; }
				// otherwise, create a new saved info key
				else { getPlatformInfo(); }
			}

			// data request
			if (sobj.type === 'data') {
				// if saved data key already exists, do nothing
				if (localStorage.getItem(datakey)) { return false; }
				// otherwise, create the new saved data key
				else {
					localStorage.setItem(datakey, JSON.stringify(sobj));
				}
			}
		}
		else {
			log('You did not pass an object containing a valid type to the createSaved() function', 'error');
			log(`Valid types are: "data" and "info". Please check your object values and try again.`,'error');	
		}
	}
	// we do not have a valid save object
	else {
		log('You did not pass a valid object to the createSaved() function', 'error');
		log(`String values are not permitted. You have to pass a 'save object' containing valid data.`,'error');		
	}
}

// TODO: come up with a better name for this function
// get system info - to write to info object
function getPlatformInfo() {
	// if we're on Chrome, get userAgentData
	if(navigator.userAgentData) {
		navigator.userAgentData.getHighEntropyValues(["architecture","platform","mobile"])
		.then((data) => { 
			// format the platform / architecture info
			let platform = data.platform +' '+ data.architecture;
			// pass platform and mobile status to generateNewInfoObj() function
			let nobj = formatPlatformData({"platform":platform,"mobile":data.mobile});
			// stringify, save to localStorage
			localStorage.setItem(infokey, JSON.stringify(nobj));
		});
	} 
	// otherwise try to use 'navigator.platform' value 
	// TODO: figure out of there's a way to extract 'mobile' value on Firefox
	else {
		// create the object
		let nobj = generateNewInfoObj({"platform":navigator.platform});
		// stringify, save to localStorage and return the object
		localStorage.setItem(infokey, JSON.stringify(nobj));
	}	
}

// format platform data for storage 
// accepts 1 argument: object containing platform info and mobile status (true|false) -- from Chrome UserAgentData
// TODO: have public IP info added to this later by an async function 
function formatPlatformData(obj) {
	// saved info data object
	const sido = {
		"type": "info",
		"device": [
			{
				"nickname": "",
				"viewport": { "width":window.innerWidth, "height":window.innerHeight },
				"mobile": obj.mobile,
				"online": navigator.onLine,
				"platform": obj.platform,
				"agent": navigator.userAgent,
				"ip": "127.0.0.1",
				"token": generateToken(48)
			}
		]
	};
	return sido;
}

// generate new SAE metadata (from JSON file)
// Accepts 1 argument: an object containing data
export function generateMetaData(data) {

	console.log('Data is: ', data);
	
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
	  "token": generateToken(48)
  };
  // save to localStorage
  localStorage.setItem(aekey, JSON.stringify(sae));
}

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

// DO DEV STUFF HERE...

// TODO: make sure this info only appears once
// log('storage.js loaded','loader');