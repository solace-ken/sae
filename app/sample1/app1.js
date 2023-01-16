// ----------------------------------------
// App 1 - Javascript functions
// ----------------------------------------

// document elements
const topbar = document.getElementById('topbar');
const main = document.getElementById('main');
const foot = document.getElementById('footer');

// page templates
const default_nav = document.getElementById('default_nav');
const default_content = document.getElementById('default_content');
const default_links = document.getElementById('default_links');

// DEV USE:
// not currently used, but an easy way to select all page templates
// const pages = document.querySelectorAll(".pages");

// load default templates
// using loadTemplate() function from router.js
topbar.innerHTML = loadTemplate('default_nav');
main.innerHTML = loadTemplate('default_content');
foot.innerHTML = loadTemplate('default_links'); 

// start the router 
startRouter('routemap.json');

function jumpToTop(){
	location.href = '#top';
}
 
// make sure the user really wants to exit
function confirmClose() {
	if (confirm("Are you sure you want to exit?") === true) {
	  // if so, hand-back control to SAE
	  appHandBack('/app/app1');
	} 
	else { return false; }	
}
