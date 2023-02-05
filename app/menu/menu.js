// ------------------------------------------------------	
// menu.js - SOLACE MENU 
//
// Default app which loads in SAE
//
// There is no EXIT button for this app.
//
// SOLACE App Engine is either showing this app, or it's
// showing a 3rd party app. There is nothing else.
//
// Menu can be controlled via API
// ------------------------------------------------------

import { verbose } from "/sae/lib/js/modules/variables.js";

import { log } from "/sae/lib/js/modules/logger.js";

import { getSaved } from "/sae/lib/js/modules/storage.js";

import { 
	loadInternalTemplate,
	loadExternalTemplate,
	loadLogoTemplate 
} from "/sae/lib/js/modules/ui.js";

// version
const menuver = '1.1.5 alpha';

// SOLACE Menu routemap 
const menumap = '/sae/app/menu/routemap.json';					

// page elements
const container = document.getElementById('container');
const viewer = document.getElementById('viewer');
const footer = document.getElementById('footer');

// Show SOLACE Menu 
function showSolaceMenu() {
	// load the viewer template
	viewer.innerHTML = loadExternalTemplate('solace_menu');
	// load the footer template
	footer.innerHTML = loadExternalTemplate('default_buttons');
	// statusbar elements
	const smlogo = document.getElementById('solacemenu');	// small, round SOLACE logo (left side)
	const dot = document.getElementById('dot');				// small, network status dot (right side)
	// set SOLACE Menu icon
	smlogo.src = blacklogo;
	// if online, show green icon
	if (navigator.onLine) { 
		dot.src = greendot; 
		dot.title = 'STATUS: ONLINE';
	}
	// start the router (with routemap)
	startRouter(menumap);
	// update DOM: show the target div
	container.style.display = 'block';
	log('Ready','solace');
}

// load the SOLACE Menu
showSolaceMenu();

// if verbose logging is true, 
if (verbose) {
	// see if bootmsg flag is true
	let shown = getSaved({"key":"bootmsg"});
	// if not, show the version number one time
	if (!shown) { log('Menu version: ' + menuver, 'solace'); }
}