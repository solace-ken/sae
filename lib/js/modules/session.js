// -----------------------------------------------------
// SESSION FUNCTIONS: READ/WRITE TO SESSION STORAGE
// -----------------------------------------------------

import { tstamp, generateNewCode } from "/sae/lib/js/modules/functions.js";
import { log } from "/sae/lib/js/modules/logger.js";
import { solsess, backupkey } from "/sae/lib/js/modules/variables.js";

// Check for SOLACE session
export function checkSession() {
	// check sessionStorage 
	const ss = sessionStorage.getItem(solsess);
	// no session...
	if (!ss) {
		//log('no session found','session');	
		//log('checking for backup...','session');	
		// look for a backup copy in localStorage
		let check = checkBackupSession(backupkey);
		// if there isn't a backup...
		if (!check) { 
			// inform the user
			//log('no backup session found', 'session');
			// generate a new SOLACE session
			log('generating new session...','session');
			createSolaceSession();
			// and return false 
			// because backup didn't exist when we initially checked...
			return false;
			// DEV NOTE: this used to direct back to basedir with no valid session
			// TODO: figure out a way to make sure user has a valid SS before proceeding
			// TODO: if not, redirect them to the basedir to get a new session first
			// location.href = basedir;
		}
		// otherwise, restore the backup and return true
		else { 
			//log('backup session found!', 'session');
			//log('restoring backup session...','session');
			// save to sessionStorage
			sessionStorage.setItem(solsess, JSON.stringify(check)); 
			// save another backup copy to localStorage
			localStorage.setItem(backupkey, JSON.stringify(check));
			return true;
		}
	}
	// TODO: add 'checkSessionTime' functionality 
	// TODO: if greater than 12 hours, generate new session
	//
	// if user already has a session, return true
	else { log('is valid','session'); return true; }
}

// Check for backup session in localStorage
// accepts 1 argument: backupkey (from variables.js)
// returns either the session data from localstorage, or false
export function checkBackupSession(backupkey) {	
	// try get the backup
	let bkup = localStorage.getItem(backupkey);
	// no backup
	if (!bkup) { return false; }
	// we have a backup!
	else {
		// parse and return the object
		let data = JSON.parse(bkup);
		return data;
	}
}

// Create new SOLACE session
// checks sessionStorage and sets a new SOLACE session if it doesn't exist
//
// DEV NOTE:
// code is formatted as: XXXX-XXXX-XXXX-XXXX-XXXX  (where 'X' = random uppercase letter or number)
// you can retrieve this value by calling the getSessionCode() function
export function createSolaceSession() {
	// check sessionStorage
	const ss = sessionStorage.getItem(solsess);
	// get a start time
	const starttime = tstamp();
	// create a 'new SOLACE session' object
	const nss = { "SOLACE": true, "starttime": starttime, "code": generateNewCode() };
	// if session doesn't exist,
	if (!ss) { 
		// save object to sessionStorage
		sessionStorage.setItem(solsess, JSON.stringify(nss)); 
		// also save a backup copy to localStorage
		// TODO: consider setting a persistent cookie (e.g. 1 year) for session instead
		localStorage.setItem(backupkey, JSON.stringify(nss));
		// show the timestamp info
		log(`timestamp is ${starttime}`,'session');
	}
	return true;
}

// Returns the 'start time' value of the SOLACE Session
// if the session doesn't exist, it creates one and tries again
export function getStartTime() {
	// check sessionStorage
	const ss = sessionStorage.getItem(solsess);
	// no SOLACE session:
	if (!ss) {
		// create one, and call this function again
		solaceSession();
		getStartTime();		
	}
	// we have a SOLACE session:
	else {
		// parse the data
		const pd = JSON.parse(ss);
		// return the 'start time' value
		const myst = pd.starttime;
		return myst;
	}
}

// Returns the code from the SOLACE Session
export function getSessionCode() {
 	// check sessionStorage
	 const ss = sessionStorage.getItem(solsess);
	 // no SOLACE session:
	 if (!ss) { log('No SOLACE Session','error'); return false; }
	 else {
		let data = JSON.parse(ss);
		return data.code;
	 }
}

// -------------------------------------------
// DEV USE:
// -------------------------------------------

// TODO: allow old token reuse instead of generating new ones all the time
// TODO: if token is less than 12 hours old, recycle it....
// TODO: otherwise, generate a new token

// check session timestamp
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
