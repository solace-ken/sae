
// show screen dimensions?
const showdims = true;

// target DIV
const container = document.getElementById('container');

// Page elements
const topbar = document.getElementById('topbar');
const topbtns = document.getElementById('topbtns');
const mainscreen = document.getElementById('mainscreen');
const leftcol = document.getElementById('leftcol');
const picviewer = document.getElementById('picviewer');
const navbtns = document.getElementById('navbtns');
const content = document.getElementById('content');

// default is dogs
showDogs();

// show the screen size 
// triggered by loading of 1x1 px image
function showScreenSize() {
	var view = `
	<br>
	<span style="font-size: x-small; text-align:center;">
		Viewport:<br>
		${window.innerHeight}h x ${window.innerWidth}w
	</span>
	`;
	const ss = document.getElementById('ss');
	if ((ss) && (showdims === true)) { ss.innerHTML = view; }
}

// load the images
function showImg(ele) {
	if (!ele) { return false; }
	var title = ''; 
	if (ele.id != 'birds_image2'){ title = 'Awwwwwww!'; } else { title = 'cAwwwwwww!'; } // that's so raven!
	picviewer.innerHTML = `<img src="pics/${ele.id}.jpg" title="${title}"/>`;
}

// birds
function showBirds(){
	topbtns.innerHTML = birds_topbtns;
	picviewer.innerHTML = birds_view;
	navbtns.innerHTML = birds_navbtns;
	content.innerHTML = birds_content;
}

// cats
function showCats() {
	topbtns.innerHTML = cats_topbtns;
	picviewer.innerHTML = cats_view;
	navbtns.innerHTML = cats_navbtns;
	content.innerHTML = cats_content;	
}

// dogs
function showDogs() {
	topbtns.innerHTML = dogs_topbtns;
	picviewer.innerHTML = dogs_view;
	navbtns.innerHTML = dogs_navbtns;
	content.innerHTML = dogs_content;	
}

// make sure the user really wants to exit
function confirmClose() {
	if (confirm("Are you sure you want to exit?") == true) {	
	  appHandBack('/app/dcb');
	} 
	else { return false; }	
}