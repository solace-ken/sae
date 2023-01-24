// ---------------------------------------------------------
// api.js - functions to control SAE via URL / JSON file
// ---------------------------------------------------------

import { log } from "/sae/lib/js/modules/logger.js";
import { 
  tstamp, 
  isObject, 
  loadJSON 
} from "/sae/lib/js/modules/functions.js";
import { 
  pageIsAPI, 
  loadSpinnerTemplate, 
  loadLogoTemplate, 
  loadErrorTemplate,
  loadIframeTemplate,
  fadeOutSpinLogo, 
  showLogo,
  showError,
  showSpinner,
  loadTemplate 
} from "/sae/lib/js/modules/ui.js";

// API version
export const apiver = '1.1.0 alpha';

// if we're on the API page,
if (pageIsAPI()) {
  // add an event-listener for the 'View Element' button
  //document.getElementById("viewelement").addEventListener("click", viewElement);
  // show console info
  log(`version ${apiver}`,'api');
  log('Ready for API commands...','api');
}

// grab URL search query (if any) and save to a 'params' (parameters) object
const urlSearchParams = new URLSearchParams(window.location.search);
export const params = Object.fromEntries(urlSearchParams.entries());

// ------------------------------------------------------	
// PRIMARY API METHODS:
// ------------------------------------------------------

// ----------------------
// DATA & INFORMATION
// ----------------------

// ----------------------
// GET: fetch data or information (read-only)
// ----------------------
if (params.get) {
  log('Requested value to GET: ' + params.get,'dev');
    // DEV USE: testing variables 
    // valid GET requests:
    // if (params.foo) {
    //    log('Foo value is: ' + params.foo,'dev');
    // }
  outputData('Requested value to GET = ' + params.get + '<br>Foo value is: ' + params.foo);
}
// ----------------------
// SET: save data or info to storage (requires token access)
// ----------------------
if (params.set) {
  log('Requested value to SET: ' + params.set,'dev');
  outputData(params.set);
}
// ----------------------
// SAVE: an alias for SET
// customized patterns for advanced 'set' commands (e.g. image uploads or blobs)
// ----------------------
if (params.save) {
  log('Requested value to SAVE: ' + params.save,'dev');
  outputData(params.save);
}
// ----------------------
// STATUS: an alias for GET
// customized patterns for advanced 'get' commands (e.g. online status or other status info)
// ----------------------
if (params.status) {
  log('Requested STATUS: ' + params.status,'dev');
  outputData(params.status);
}
// ----------------------
// INFO: an alias for GET
// customized patterns for advanced 'get' commands (e.g. current app, last app, version, etc.)
// ----------------------
if (params.info) {
  log('Requested INFO: ' + params.info,'dev');
  outputData(params.info);
}
// ----------------------
// FORMAT: a sub-routine for SET and GET 
// ----------------------
// allows user to request data to be saved in specific formats (e.g. JSON)
// TODO: add functionality!
// TODO: currently only outputs a test object
if (params.format) {
  // JSON format is being requested...
  if (params.format === 'json') {
    // DEV USE:
    // create some sample data
    let td = {};
    td.foo = 'bar';
    td.bar = 'baz';
    td.baz = 'bat';
    log('Requested JSON format: ' + JSON.stringify(td),'dev');
    // TODO: don't forget to use correct content headers for MIME types
    console.log('Object is: ', td);
    // if we're on the API page, show output
    outputData(JSON.stringify(td));
  }
}

// SEE ALSO: Entire "JSON DATA" section down below...
// format=json -- is to request output from SAE in JSON format
// json=/path/to/file.json -- is to pass JSON to SAE through the API

// -------------------------------
// USER INTERFACE (UI):
// -------------------------------

// --------------------------
// SHOW: display UI elements
// --------------------------
if (params.show) {
  log('Requested value to SHOW: ' + params.show,'dev');
  outputData(params.show);
}
// --------------------------
// HIDE: hide UI elements
// --------------------------
if (params.hide) {
  log('Requested value to HIDE: ' + params.hide,'dev');
  outputData(params.hide);
}

// ------------------------------------------------------------
// TEMPLATE REQUEST: user is requesting a specific template 
// valid options are: logo, spinner, error, iframe
// default is 'logo'. syntax: /?tpl=logo
// ------------------------------------------------------------
if (params.tpl) {

  // figure out which template they want
  switch(params.tpl) {

    // LOGO:
    case 'logo':
      // logging
      log('Showing SOLACE Logo','api');
      // load the logo template
      loadLogoTemplate();
      // are there any special effects (sfx) requests?
      if (params.sfx) {  

        // user explicity requested NO sfx --- "I said NO salt in my margarita!" 
        // if sfx is: '0', 'false', 'no', or 'none', show static logo with no effects
        if ((params.sfx === '0') || (params.sfx === 'false') || (params.sfx === 'no') || (params.sfx === 'none')) { 
          showLogo(); 
        }
        
        // create an array of valid special effects
        const sfxArr = ['spin','spinforever','fadeinspin','fadeoutspin'];
        // if request is NOT in the array,show an error
        if (!sfxArr.includes(params.sfx)) { 
            log(`Requested special effect: '${params.sfx}' is not valid`,'warn');
            // TODO: generate this list automatically from the array
            log(`Valid sfx options are: ${sfxArr[0]}, ${sfxArr[1]}, ${sfxArr[2]}, ${sfxArr[3]}`,'api'); 
        } else {  
            // request is in the array...
            // if we do have a valid request, apply the special effect:
            if (params.sfx === sfxArr[0]) { 
              console.log('Made it here');
              showLogo('spin'); 
              log('Adding Spin Effect','api'); 
            }
            if (params.sfx === sfxArr[1]) { showLogo('spinforever'); log('Adding Spin Forever Effect','api'); } 
            if (params.sfx === sfxArr[2]) { showLogo('fadeinspin'); log('Adding Fade-In Spin Effect','api'); }
            if (params.sfx === sfxArr[3]) { fadeOutSpinLogo(); log('Adding Spin, Fade-Out Effect','api'); }    

        }
      } 
      // default: show a static logo
      else { showLogo(); }
    break;

    // SPINNER:
    case 'spinner':

      // logging
      log('Showing the Spinner Template','api');

      // load the spinner template  
      loadSpinnerTemplate();      
  
      // set up vars
      var img = 'gears';              // img or image
      var head = 'A Spinner Heading'; // head, header, or heading
      var msg;                        // spinner message
      // if we have a spinner header ('head) update the var
      // also accept 'header' or 'heading' in case they forget the syntax
      if ((params.head) || (params.header) || (params.heading)) {
        // if they pass 'header' or 'heading', set to 'head' instead
        if (params.header) { params.head = params.header; }
        if (params.heading) { params.head = params.heading; }
        // logging
        log('Using spinner header: ' + params.head,'dev');
        // set the value 
        head = params.head;
      }
      // if we have spinner image ('img') parameter in the url,
      // DEV NOTE: also accept 'image' in case they forget the syntax
      if ((params.img) || (params.image)) {
        // if they pass 'image', set to 'img' instead...
        if (params.image) { params.img = params.image; }
        // if the user is requesting 'gears' image
        // do nothing... gears is already the default 
        if (params.img === 'gears') {
          // logging
          log('Using spinner image: gears','dev');
        }
        // if the user is requesting 'blocks' image
        if (params.img === 'blocks') {
          log('Using spinner image: blocks','dev');
          // set the value
          img = 'blocks';
        }
      }
      // if we have a spinner message ('msg') update the var
      if (params.msg) {
        log('Using spinner message: ' + params.msg,'dev');
        msg = params.msg;
      } else {
        msg = `Spinner message with ${img} image`;
      }
      // create a new sample spinner object
      var ssob = {
        "header": head,
        "image": img,
        "message": msg
      }; 
      // if user is passing in-url JSON data
      if (params.data) {
        // URI-decode the data
        let cdata = decodeURI(params.data);
        // parse it
        let pdata = JSON.parse(cdata);
        ssob = pdata;
      }
      // show the spinner
      showSpinner(ssob);
    break;

    // ERROR:   
    case 'error':
          log('Showing Error','engine');
          
          // create test error object
          let testerror = { 
            "title":"This is a Test Error!", 
            "cause":"This was created by a developer creating test errors.", 
            "solution":"Stop creating test error messages and they will go away." 
          };

          // load the error template
          loadErrorTemplate();
          
          // display the error
          showError(testerror);

          outputData('The Error template would appear on the index page with this API request');
          break;

    // IFRAME
    case 'iframe':
        var m = 'The iframe template was requested';
        log(m,'engine');
        // if they're passing an iframe src (url), load it
        // TODO: add error-checking here to avoid 404s
        if (params.src) {
          log('iframe src is: ' + params.src);
          loadIframeTemplate(params.src);
        }
        // if no iframe URL is passed, load the gray page
        else {
          loadIframeTemplate(); 
        }
        // show the data on the API page
        outputData(m);
        break;

    // DEFAULT
    default:
        // no match found, show an error
        var m = `The template you requested ('${params.tpl}') does not exist`;
        log(m,'error');
        alert(m);

  }

}

// ======================================================================================
// JSON DATA: modify the User Interface (UI) by passing JSON data
// 
// TWO METHODS:
// 
// 1. Pass JSON directly in the URL (minified and URI-encoded):
// Example: https://localhost:501/sae/?json=%7B%22tpl%22:%22spinner%22,%22width%22:%22700%22,%22height%22:%22250%22,%22header%22:%22This%20Is%20A%20Sample%20Heading%22,%22image%22:%22gears%22,%22message%22:%22This%20is%20A%20Sample%20Status%20Message%22%7D
//
// 2. Pass the path to a JSON file (already on the server):
// Example 1: /sae/api/?json=/sae/lib/json/test/blocks-sample.json
// Example 2: /sae/api/?json=/sae/lib/json/test/gears-sample.json
//
// TODO: eventually allow JSON uploads to a folder
//
// ======================================================================================

// User is passing JSON data
if (params.json) {

  // uri-decode the json data...
  let cldata = decodeURI(params.json);
  
  // WHICH METHOD ARE WE USING?

  // METHOD 1:
  // if it starts with a left curly brace ({), we're using embedded JSON via URL
  // TODO: check to see if I have to look for '%7B' too...?
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

  // METHOD 2:
  // if it starts with a slash (/), we're using /path/to/file.json
  if (cldata.startsWith("/")) { 
    log('User is passing a JSON file path','api');
    // LOAD JSON (passing the callback function)
    loadJSON(cldata, processResults);
  }

}

// callback function to process JSON data (used by Method 2 - 'path to json file')
function processResults(data) {
  // if we have data...
  if (data) {
    
    // DEV USE: SHOW DATA
    // TODO: tie stuff like this into 'devmode'
    /*
    log('Template is: ' + data.tpl,'dev');
    log('Width is: ' + data.width,'dev');
    log('Height is: ' + data.height,'dev');
    log('Header is: ' + data.header,'dev');
    log('Image is: ' + data.image,'dev');
    log('Message is: ' + data.message,'dev');
    */ 

    // if we're on the API page, 
    if (pageIsAPI()) { 
      // show HTML output
      outputData(data); 
      // write API_data to localstorage 
      // TODO: add this to storage instead
      localStorage.setItem('API_Data', JSON.stringify(data));
    } 
    // we're not on the API page...
    else {
      // otherwise, figure out which template to load
      switch (data.tpl) {
          case 'logo':
            console.log('Template is logo');
            loadLogoTemplate();
            showLogo(data.sfx); // TODO: figure out why this is different from /?tpl=logo&sfx=fadeoutspin
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

// -----------------------------------------------------------------
// DEV USE: Test Options
// These features and options are not seen by end-users
// -----------------------------------------------------------------
//
// TURN DEV MODE ON
//
// enable devmode: /sae/?devmode=true
if (params.devmode === 'true') { 
  devModeOn();
	log('Dev Mode enabled','dev');
}
//
// TURN DEV MOD OFF
//
// disable devmode: /sae/?devmode=false
if (params.devmode === 'false') { 
  devModeOff();
	log('Dev Mode disabled','dev');
  // redirect to clear the URL
  // this may become annoying for development
  // TODO: disable this redirect if devmode is active
  location.href = '/sae/';
}
//
// generate test data: /sae/?test=true (or, any truthy value)
if (params.test) {
    // create some test data
    let nobj = {
        "name": "Foobar Industries, Inc.",
        "url": "https://foobar.com",
        "id": "0123456789",
        "phone": "1-800-123-4567",
        "date": tstamp()  // timestamp in JSON format
    };
    // show HTML output on the API page 
    // will also display test object in console log
    outputData(nobj);
}

// ------------------------------------------------------------------------------------------------------
// Output HTML - viewable at: /api/index.html or /api/
// Displays API data to a page element (target div = 'display')
//
// To jump directly to named anchor on the page, use hashtag '#output' at the end of the url
// Example: http://localhost/api/?test=true#output
// -------------------------------------------------------------------------------------------------------
function outputData(obj) {

  // only attempt HTML output if we're on /api/ page
  if (pageIsAPI()) {
    // is it really an object?
    if (isObject(obj)) {
        // output to target div
        display.innerHTML = `<span id="objtext" class="optxt">JSON Object:<br>${JSON.stringify(obj)}</span>`;
        console.log(obj);
        console.log('Type: ' + typeof(obj));
    } else {
        // not an object (e.g. string or number)
        // output to target div
        display.innerHTML = `<span id="strtext" class="optxt">String: ${obj}</span>`;
        console.log(obj);
        console.log('Type: ' + typeof(obj));
    }
  }
  else { 
    // otherwise, show console message
    log('Go to: /sae/api/?key=value to see API data','api');
  }

}

// Preview Element (e.g. a spinner or logo) on the API page
// non-visual components will display an error onscreen with an 'Back' button
function viewElement() {
  // get API_Data from localstorage
  let data = localStorage.getItem('API_Data');
  // if we have some data...
  if (data) {
    // parse it
    let pd = JSON.parse(data);
    // template names are different on /api/ page
    if (pageIsAPI) {
      display.innerHTML = loadTemplate('spintpl');
    } 
    // show the spinner
    showSpinner(pd);
  } 
  // if we have no element to preview...
  else {
    let m = 'There is no visual component to display';
    log(m,'dev');
    outputData(m + '<p><button onclick="location.reload()">Back</button></p>');
    return false;
  }
}

// TODO: makes sure this only loads one time on start up
// log('api.js loaded','loader');
// DEV USE: 
// log('version: ' + apiver,'api');