

// images
const reddot = '/sae/lib/img/circle-red-filled.svg';			// red status icon
const greendot = '/sae/lib/img/circle-green-filled.svg';		// green status icon
const blacklogo = '/sae/lib/img/solace-logo-round.svg';			// black round SOLACE logo
const bluelogo = '/sae/lib/img/solace-logo-round-blue.svg';		// blue round SOLACE logo
// const yellowdot = '/sae/lib/img/circle-yellow-filled.svg';	// yellow status icon (not currently used)
// const bluedot = '/sae/lib/img/circle-blue-filled.svg';		// blue status icon (not currently used)

// clear hashes in the URL
// May be deprecated in the future...
//
// used by SOLACE Menu button 
// TODO: need to find a better way to deal with this
// TODO: hashtag navigation (location.hash) is not detected by API yet
// TODO: need to get API to respond properly to hashtags and route accordingly (maybe clearing automatically?)
// TODO: but, calling this function 10,000 times on /app/menu/ is not a good thing
function clearHashTags() {
	history.replaceState({}, document.title, ".")	
}

// change logo blue on hover
function changeLogo() { logo.src = bluelogo; }

// reset logo to black on unhover
function resetLogo() { logo.src = blacklogo; }

// change blue, spin, and change back to black
// a visual indicator to let user know menu is there
function animateLogo() {
	logo.src = bluelogo;
	logo.style.animationName = 'spinbtn';
	logo.style.animationDuration = '1s';	
}

// Animate SOLACE Menu icon after 4 seconds
function logoSpin() { setTimeout(function(){ animateLogo(); return true; }, 4000); }

// show network status
// TODO: get colors right (same as dot icons)
// TODO: add event listener or localstorage check for status
function showNetStatus() {
	// target div
	let ns = document.getElementById('netstatus');
	// online status (from browser)
	let isOnline = navigator.onLine;
	// check to see if user is online
	if (isOnline) {
		// if yes, show the ONLINE message
		ns.innerHTML = `<div class="networkstatus online" title="Status: ONLINE">ONLINE</div>`;
	} else {
		// if no, show the OFFLINE message
		ns.innerHTML = `<div class="networkstatus offline" title="Status: OFFLINE">OFFLINE</div>`;					
	}	
}