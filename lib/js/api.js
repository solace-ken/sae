
// ---------------------------------------------------------
// api.js - functions to control SAE via URL / JSON file
// ---------------------------------------------------------
//
// This will probably consist of 2 different backend tools:
// PHP (for database access) and Javascript (for local access)
// Eventually, we'll' add Axios for better async functionality
//
// Primary methods:
//
// - Set - create or modify data in localstorage or remote db (via PHP)
// - Get - data from localstorage or remote db (via PHP)
// - Show/Hide - page ui elements, templates, etc.
// - Save - save file to localstorage or remote file system
// - Fetch - download file from local or remote file system
// - Status - online (network) status, current app, last app, errors, database status, handoff state
// - Info - engine meta-data, browser info, device info, timestamps, session data, etc
//
// Additional methods:
//
// - Devmode
// - Test
// - Log (On/Off + Verbosity + export)
//
// 
// ---------------------------------------------------------

// if logger.js isn't loaded, define the log function
if (!(typeof log==='function')){console.log('logger.js is not loaded');function log(msg,t=null){console.log(msg);}}

// logging
log('api.js loaded','loader');

// grab URL search query (if any) and save to 'params' object
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// --------------------------------------------------------------------------------------	
// ACTION REQUESTS: User is requesting an action
// --------------------------------------------------------------------------------------	
//
// DEV NOTES:
//
// Add Parameters:
// 
// Spinner requires spinner object with header, image, and statmsg
// 
// /?tpl=spinner&w=700&h=250&data={"header":"This%20Is%20A%20Sample%20Heading","image":"gears","statmsg":"This%20is%20A%20Sample%20Status%20Message"}
//
// Generic Spinner JSON:
//
// /lib/js/generic-spinner.json
// 
// Data in URLs should be passed in URI-encoded, valid JSON format

// User is loading a template - syntax: /?tpl=name:
//
if (params.tpl) {

  // figure out which template they want
  switch(params.tpl) {

    // --------------------------------  
    // LOGO:
    // -------------------------------- 
    case 'logo':

      // logging
      log('Showing SOLACE Logo','engine');
      // load the logo template
      loadLogoTemplate();
      // are there any special effects (sfx) requests?
      if (params.sfx) {     
          // create an array of valid effects
          const myfxArr = ['0','false','no','none','spin','fadeinspin','fadeoutspin'];// TODO: document this hidden feature
          // if request is not in the array,show an error and break
          if (!myfxArr.includes(params.sfx)) { 
              log(`Requested special effect: '${params.sfx}' is not valid`,'warn'); 
              break; 
          } 
          // otherwise, request is in the array...
          else {  
              // user explicity requested NO effects -- "I said NO salt in my margarita!"
              //
              // if request is: '0', 'false', 'no', or 'none', show a static logo with no effect
              if ((params.sfx === myfxArr[0]) || (params.sfx === myfxArr[1]) || (params.sfx === myfxArr[2]) || (params.sfx === myfxArr[3])) { showLogo(); }
              //
              // if we do have a valid request, apply the special effect:
              if (params.sfx === myfxArr[4]) { showLogo('spin'); log('Adding Spin Effect','engine'); }
              if (params.sfx === myfxArr[5]) { showLogo('fadeinspin'); log('Adding Fade-In Spin Effect','engine'); }
              if (params.sfx === myfxArr[6]) { fadeOutSpinLogo(); log('Adding Spin, Fade-Out Effect','engine'); log(`Page element 'logo' set to 'display: none'`,'dev'); log(`You must call 'showLogo()' again before you can use the element`,'dev'); }    
          }
      } 
      // default is to show static logo
      else { showLogo(); }

    break;

    // --------------------------------    
    // SPINNER:
    // -------------------------------- 
    case 'spinner':
    
      // logging
      log('Showing Spinner','engine');
      // load the spinner template  
      loadSpinnerTemplate();

    break;

    // ----------  
    // ERROR:
    // ----------        
      case 'error':
        log('Showing Error','engine');
        outputData('The Error template would appear on the index page with this API request');
        break;

    // -------------------  
    // LOAD DEFAULT APP
    // -------------------   
      case 'default':
        log('Loading Default App','engine');
        break;

    // --------------------------------------------
    // DEFAULT SWITCH STATEMENT:
    // --------------------------------------------      
      default:
      // no match found, show an error
        let m = `The template you requested ('${params.tpl}') does not exist`;
        log(m,'error');
        alert(m);
  }
}

// ------------------------------------------------------	
// PRIMARY METHODS:
// ------------------------------------------------------

// GET request
if (params.get) {
    log('Requested value to GET: ' + params.get,'dev');
    if (params.foobar) {
        log('Foobar value is: ' + params.foobar,'dev');
    }
    outputData(params.get);
}

// SET request
if (params.set) {
    log('Requested value to SET: ' + params.set,'dev');
    outputData(params.set);
}

// ======================================================================================
// DEV NOTES:
// 
// There are two methods to submit JSON requests:
// 
// 1. Minify, URI-encode, and stringify the JSON data and pass directly in the URL
// Example: /api/?json={"tpl":"spinner","width":"700","height":"250","header":"This%20Is%20A%20Sample%20Heading","image":"gears","message":"This%20is%20A%20Sample%20Status%20Message"}
// 
// 2. Point to a .json file already on the server (or allow uploads)
//
// Example 1: /api/?json=/lib/js/blocks-sample.json
// Example 2: /api/?json=/lib/js/gears-sample.json
// 
// If you call 'data' parameter instead of 'json', you can mix JSON data with URL parameters
//
// Using URL parameters to tell API the template name and passing additional data in JSON format:
// Example: /api/?tpl=spinner&data={"header":"Sample%20Heading","image":"blocks","message":"This%20is%20A%20Test%20Message"}
// 
// If you call 'json' parameter, you can only use JSON, and must include template name inside the JSON data:
// Example: /api/?json={"tpl":"spinner","header":"Sample%20Heading","image":"gears","message":"Sample%20Status%20Message"}
//
// ======================================================================================

// -------------------------------
// User is passing JSON data
// -------------------------------

if (params.json) {

  // url decode input
  let cldata = decodeURI(params.json);

  // METHOD 1
  //
  // if it starts with a left curly brace ({), we're using embedded JSON via URL (method 1)
  if (cldata.startsWith("{")) { 

    log('User is passing JSON directly via URL','dev');

    // parse the data
    let pd = JSON.parse(cldata);

    // if we have parsed data...
    if (pd) {

      // if we're on the API page, show HTML output
      if (pageIsAPI()) { outputData(pd); }

      // figure out which template to show
      switch (pd.tpl) {

        case 'logo':
          console.log('Template is logo');
          loadLogoTemplate();
          showLogo();
          break;

        case 'spinner':
          // load the spinner template
          loadSpinnerTemplate();
          // try to render the spinner object
          showSpinner(pd);
          break;

        default: 
          console.log('Invalid template request');          
      }
    }
  }

  // METHOD 2
  //
  // if it starts with a slash (/), we're using /path/to/file.json
  if (cldata.startsWith("/")) { 
    log('User is passing JSON file path','dev');
    // LOAD JSON (passing the callback function)
    loadJSON(cldata, processResults);
  }

}

// callback function to process JSON data (used by )
function processResults(data) {

  if (data) {

    // DEV USE:
    /* console.log('Template is: ' + data.tpl);
    console.log('Width is: ' + data.width);
    console.log('Height is: ' + data.height);
    console.log('Header is: ' + data.header);
    console.log('Image value is: ' + data.image);
    console.log('Message is: ' + data.message); */

    // if we're on the API page, 
    if (pageIsAPI()) { 
      // show HTML output
      outputData(data); 
      // write to localstorage
      localStorage.setItem('API_Data', JSON.stringify(data));
    }
    else 
    {
      // otherwise, figure out which template to load
      switch (data.tpl) {
        case 'logo':
          console.log('Template is logo');
          loadLogoTemplate();
          showLogo(data.sfx);
          break;
        case 'spinner':
          // load the spinner template
          loadSpinnerTemplate();
          // try to render the spinner object
          showSpinner(data);
          break;
        default: 
          console.log('Invalid template request');          
      }    
    }    
  }
}


// Show/Hide
// Save
// Fetch
// Status
// Info

// -------------------------
// DEV USE: Testing Options
// -------------------------

// send test data: /?test=true
if (params.test) {
    let nobj = {
        "name": "Foobar Industries",
        "id": "123456789",
        "date": "2023-01-13T16:04:50.057Z"
    };
    outputData(nobj);
}

// enable devmode: /sae/?devmode=true
if (params.devmode === 'true') { 
	devmode = true;
	log('Dev Mode enabled','dev');
}

// ------------------------------------------------------------------------------------------
// Output HTML - View at: /api/index.html
// writes data to a page element (target div)
// ------------------------------------------------------------------------------------------
function outputData(obj) {

  // only attempt HTML output if we're on /api/ page
  if (pageIsAPI()) {
      // if user is passing an object...
      if (isObject(obj)) {
        // show the object in the console
        //log('Data type is: ' + typeof(obj),'dev');
        //log("Object is: ","dev");
        //console.log(obj);  // TODO: note: logger.js doesn't display objects properly so, use console.log() instead
        // output to target div
        display.innerHTML = `<span id="objtext" class="optxt">JSON Object:<br>${JSON.stringify(obj)}</span>`;
      }
      // if user is passing different type (e.g. string or number)
      else {
        // show the non-object in the console
        //log(`String is: "${obj}"`,'dev');
        //log('Data type is: ' + typeof(obj),'dev');
        // output to target div
        display.innerHTML = `<span id="strtext" class="optxt">String: ${obj}</span>`;
      }
  }
  else { 
      // otherwise, show console message
       log(`HTML output is not available on this template`,'warn');
       log('Go to: /sae/api/?key=value to see HTML output','dev')
       log(`Test data is: ${JSON.stringify(obj)}`,'engine');
       log('Data type is: ' + typeof(obj), 'engine');
  }
}

// Preview Element (e.g. spinner or logo)
function viewElement() {
  // get data from localstorage
  let data = localStorage.getItem('API_Data');
  // if we have data...
  if (data) {
    // parse the data
    let pd = JSON.parse(data);
    // load spinner template to API target div
    display.innerHTML = loadTemplate('spintpl');
    // and, show the spinner (passing data object)
    showSpinner(pd);
  } 
}

// checks if we're on the API page (/api/index.html)
// returns: ( true | false )
function pageIsAPI()  {
  let lp = location.pathname;
  if ((lp === '/sae/api/index.html') || (lp === '/sae/api/')) {
    return true;
  }
  else { return false; }
}

// ---------------------------------------------------------
// DUPLICATED FROM SAE.JS
// DID NOT WANT TO HAVE TO INCLUDE THE ENTIRE JS FILE
// ---------------------------------------------------------

// show spinner: requires Spinner Template
// accepts 1 argument: spinner object (header, image, message)
// image options are: 'gears' or 'blocks'
function showSpinner(obj) {
	// if we have no spinner object, show an error
	if (!obj){ console.error('There is no spinner object to display'); return false; }
	// check to make sure it's an object
	if (isObject(obj)) {
		// if so, show the spinner element
		document.getElementById('spinner').style.display = 'block';
		// and set values from obj
		document.getElementById('header').innerHTML = obj.header;
		document.getElementById('message').innerHTML = obj.message;
		if (obj.image === 'gears') { showGears(); }		
		if (obj.image === 'blocks') { showBlocks(); }					
	}
}

// show gears and blocks animation
function showGears() { document.getElementById('gears').style.display = 'block'; }
function showBlocks() { document.getElementById('blocks').style.display = 'block'; }