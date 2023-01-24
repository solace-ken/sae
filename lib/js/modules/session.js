// -----------------------------------------------------
// SESSION FUNCTIONS: READ/WRITE TO SESSION STORAGE
// -----------------------------------------------------

import { tstamp } from "/sae/lib/js/modules/functions.js";
import { log } from "/sae/lib/js/modules/logger.js";

import { basedir, solsess, backupkey } from "/sae/lib/js/modules/variables.js";

// Check SOLACE session (or redirect)
export function checkSession() {
	// check for SOLACE session (true|false)
	const ss = sessionStorage.getItem(solsess);
	// no session: 
	if (!ss) {	
		// look for a backup copy in localStorage
		let check = checkBackupSession(backupkey);
		// if there isn't one, redirect to root
		if (!check) { location.href = basedir; }
		// otherwise, update values
		else { 
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
	// if user has a session, return true
	else { return true; }
}

// SOLACE session
// checks sessionStorage and sets a new SOLACE session
export function solaceSession() {
	// check sessionStorage
	const ss = sessionStorage.getItem(solsess);
	// get a timestamp in JSON format
	const starttime = tstamp();
	// create a new SOLACE session object
	const t = { "SOLACE": true, "starttime": starttime };
	// if we don't have a session,
	if (!ss) { 
		// save to sessionStorage
		sessionStorage.setItem(solsess, JSON.stringify(t)); 
		// also save a backup copy to localStorage in case the user closes the tab
		// this way we can check to see if they've used SAE before (until they clear storage)
		// TODO: consider setting persitent cookie with this info for longer-term ID
		localStorage.setItem(backupkey, JSON.stringify(t));
		// show info in console
		log(`timestamp is ${starttime}`,'session');
	}
	return true;
}

// Returns the 'start time' value of the SOLACE Session
// if the session doesn't exist, it creates one and tries again
export function getStartTime() {
	// check sessionStorage
	const ss = sessionStorage.getItem(solsess);
	// if we don't have a session,
	if (!ss) {
		// create one, and call this function again
		solaceSession();
		showGoTime();		
	}
	// we do have a SOLACE session:
	else {
		// parse the data
		const pd = JSON.parse(ss);
		// return the 'start time' value
		const myst = pd.starttime;
		return myst;
	}
}

// Check for backup session in localStorage
export function checkBackupSession(backupkey) {
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

// TODO: make sure this info only appears once
// log('session.js loaded','loader');