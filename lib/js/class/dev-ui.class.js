
// DEV USE ONLY!
// NOT CURRENTLY USED!

// --------------------------------------------------------------------
// UI Class: generates user interface for SAE
// accepts 1 arguments: ui object 
// 
// ui obejct should contain: 
//
// source = name of the app calling renderView()
// templates requested
// element IDs
// etc
// etc
//
// --------------------------------------------------------------------


class ui 
{
	constructor(viewobj='') 
	{
		if ((viewobj == null)||(viewobj == '')) {
			this.name = '';
			this.tbnav = '';
			this.navbuttons = '';
			this.content = '';
			this.infobox = '';
			this.sbmsg = '';
			this.sbicons = '';		  
		} 
		else {
			this.name = viewobj.name;
			this.tbnav = viewobj.tbnav;
			this.navbuttons = viewobj.navbuttons;
			this.content = viewobj.content;
			this.infobox = viewobj.infobox;
			this.sbmsg = viewobj.sbmsg;
			this.sbicons = viewobj.sbicons;		  
		}
	}
	
    // WE DON'T HAVE STATUS MESSAGES ON THIS UI
    // BUT, THE GARDEN UI HAS STATUS BAR MESSAGES
    //
	// updates status message
	statusMsgUpdate(msg)	
	{
		var sbm = document.getElementById('sbmsg');
		sbm.innerHTML = msg;
	}
	
	// updates status icons
	statusIconsUpdate(html)
	{
		console.log('Arrived at statusIconsUpdate');		
	}

    // WE DON'T HAVE AN INFOBOX ON THIS UI
    // BUT, THE GARDEN UI HAS AN INFOBOX
	
	// updates infobox
	infoBoxUpdate (html)
	{
		console.log('Arrived at infoBoxUpdate');	
	}
	
    // RENDER:
	// output the object to the user
    // TODO: add some error detection
	renderView() 
	{
		// generate the HTML
		var content = '<header id="topbar" class="topbar">';
		content +=	'<div id="brand" class="brand">';
		//content +=  	this.brand;		// Brand
		content +=  '</div>';
		content +=	'<nav id="tbnav" class="tbnav">';
		//content += 		this.tbnav;		// Topbar Navigation
		content +=  '</nav>';
		content +=	'</header>';
		content +=	'<section id="leftpane" class="leftpane">';
		content +=	'<div id="logobox" class="logobox">';
		//content +=  '<img src="'+ this.logo +'" width="90" height="50" border="0" alt="Logo">';
		content +=  '</div>';
		content +=	'<nav id="navbuttons" class="navbuttons">';
		//content += 		this.navbuttons;	// Main Navigation Buttons
		content +=  '</nav>';
		content +=	'<section id="infobox" class="infobox">';
		//content += 		this.infobox;	// Infobox
		content +=  '</section>';
		content +=	'</section>';
		content +=	'<main id="rightpane" class="rightpane">';
		//content += 		this.content	// Main Content 
		content +=	'</main>';
		content +=	'<footer id="statusbar" class="statusbar">';
		content +=	'<section id="sbmsg" class="sbmsg" role="status">';
		//content +=  	this.sbmsg;		// Statusbar Message
		content +=  '</section>';
		content +=	'<section id="sbicons" class="sbicons" role="status">';
		//content +=  	this.sbicons;	// Statusbar Icons
		content +=  '</section>';
		content +=	'</footer>';

		// update DOM
		document.getElementById('ui').innerHTML = content;
	}
}