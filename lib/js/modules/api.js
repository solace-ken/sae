// ---------------------------------------------------------
// api.js - functions to control SAE via URL / JSON file
// ---------------------------------------------------------

// IMPORT DATA AND FUNCTIONS:

import { 
  verbose, 
  basedir,
  solbackfile 
} from "/sae/lib/js/modules/variables.js";

import { 
  log 
} from "/sae/lib/js/modules/logger.js";

import { 
  tstamp,  
  loadJSON,
  dumpStorageToJson
} from "/sae/lib/js/modules/functions.js";

import { 
  devModeOn,
  devModeOff,
  loadSpinnerTemplate, 
  loadLogoTemplate, 
  loadErrorTemplate,
  loadIframeTemplate,
  fadeOutSpinLogo, 
  showLogo,
  hideLogo,
  showError,
  showSpinner,
  hideSpinner,
  hideError,
  ui
} from "/sae/lib/js/modules/ui.js";

import { 
  getSaved,
  setSaved
} from "/sae/lib/js/modules/storage.js";

// ------------------------------------------------------
// DEV USE:
// TODO: add event-listener for the 'View Visual Element' button on API page
// TODO: example: document.getElementById("viewelement").addEventListener("click", viewElement);

// API version
export const apiver = '1.1.5 alpha';

// grab URL search query (if any) and save to a 'params' (parameters) object
const urlSearchParams = new URLSearchParams(window.location.search);
export const params = Object.fromEntries(urlSearchParams.entries());

// ------------------------------------------------------	
// PRIMARY METHODS:
// ------------------------------------------------------

// DATA & INFORMATION

// ----------------------
// GET: fetch data or information (read-only)
// ----------------------
if (params.get) {
  log(`Request type is: "GET" —> Key is: "${params.get}"`,'api');
  //dtype.innerText = 'Request Type is: GET';
  //outputData(params.get);
  // GET requests go here....
  // get=data&key=foobar
}
// ----------------------
// SET: save data or info to storage (requires token access)
// ----------------------
if (params.set) {
  log(`Request type is: "SET" —> Key is: "${params.set}"`,'api');
  //dtype.innerText = 'Request Type is: SET';
  //outputData(params.set);
  // SET requests go here....
}
// ----------------------
// SAVE: an alias for SET
// customized patterns for advanced 'set' commands (e.g. image uploads or blobs)
// ----------------------
if (params.save) {
  log(`Request type is: "SAVE" —> Key is: "${params.save}"`,'api');
  //dtype.innerText = 'Request Type is: SAVE';
  //outputData(params.save);
  // SAVE requests go here....
}
// ----------------------
// STATUS: an alias for GET
// customized patterns for advanced 'get' commands (e.g. online status or other status info)
// ----------------------
if (params.status) {
  log(`Request type is: "STATUS" —> Key is: "${params.status}"`,'api');
  //dtype.innerText = 'Request Type is: STATUS';
  //outputData(params.status);
  // STATUS requests go here....
}
// ----------------------
// INFO: an alias for GET
// customized patterns for advanced 'get' commands (e.g. current app, last app, version, etc.)
// ----------------------
if (params.info) {
  log(`Request type is: "INFO" —> Key is: "${params.info}"`,'api');
  //dtype.innerText = 'Request Type is: INFO';
  //outputData(params.info);
  // INFO requests go here....
}

// -----------------------------------------
// FORMAT: a sub-request for GET and SET 
// allows user to request data to be saved in specific formats (e.g. JSON)
// -----------------------------------------

// make sure we have a GET or SET request first....
if ((params.get) || (params.set)) {
  log('We have a valid SET or GET request. Proceed with any format requests....','api');
  // do we have a format request?
  if (params.format) {

    // JSON format requested...
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
    if (params.format !== 'json') {
      log('This format is not supported yet','api');
    }

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
    // show the UI
    if (params.show === 'ui') {
      ui.style.display = 'block';
      log(`UI is now being displayed`,'api');
      log (`Optional parameter: "color". Usage: /?show=ui&color=red`,'api');
      // if they pass a color parameter, update the UI
      if (params.color) {
        ui.style.borderColor = params.color;
      }
    }
    // show the SOLACE Menu
    if (params.show === 'menu') {
      setSaved({"showmenu":true});
      loadIframeTemplate('/sae/app/menu/');
    }
    // show the Logo
    if (params.show === 'logo') {
      loadLogoTemplate();
      showLogo();
    }
    // show an Error
    if (params.show === 'error') {
      // new error object
      let error = { 
        "title":"This Is A Title", 
        "cause":"This sentence describes the cause of the problem.", 
        "solution":"This sentence tries to offer some solutions to the user that they can try." 
      };
      loadErrorTemplate();
      showError(error);
    }
  // show the Spinner
  if (params.show === 'spinner') {
      loadSpinnerTemplate();
      showSpinner({"head":"This Is A Heading","img":"gears","msg":"This is a sample message"});
  } 
}
// --------------------------
// HIDE: hide UI elements
// --------------------------
if (params.hide) {
    log('Requested value to HIDE: ' + params.hide,'dev');
    // hide the UI
    if (params.hide === 'ui') {
      ui.style.display = 'none';
      log('UI has been hidden','api');
      // if they are still passing params, show an error
      if (params.color) {
        log(`Color requests are ignored when the UI is hidden`,'api');
      }
    }
    // hide the SOLACE Menu
    if (params.hide === 'menu') {
      loadLogoTemplate();
      fadeOutSpinLogo();
      log('Menu has been hidden','api');
      setSaved({"showmenu":false});
    }
    // hide the Logo
    if (params.hide === 'logo') {
      loadLogoTemplate();
      hideLogo();
      log('Logo has been hidden','api');
    }
    // hide the Error 
    if (params.hide === 'error') {
      loadErrorTemplate();
      hideError();
      log('Error has been hidden','api');
    }
    // hide spinner element
    if (params.hide === 'spinner') {
      loadSpinnerTemplate();
      hideSpinner();
      log('Spinner has been hidden','api');
    }
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
        // if request is NOT in the array, show an error
        if (!sfxArr.includes(params.sfx)) { 
            log(`Requested special effect: '${params.sfx}' is not valid`,'warn');
            log(`Valid sfx options are: ${sfxArr[0]}, ${sfxArr[1]}, ${sfxArr[2]}, ${sfxArr[3]}`,'api');
            // TODO: write a function to generate this list automatically (from the array)
        } else {  
            // request is in the array...
            // if we do have a valid request, apply the special effect:
            if (params.sfx === sfxArr[0]) { 
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

      // load the spinner template  
      loadSpinnerTemplate();   

      // TODO: set up an object here instead...   
      // set up vars
      var img = 'gears';              // image
      var head = 'A Spinner Heading'; // heading
      var msg;                        // message
      // also accept 'header' or 'heading'
      if ((params.head) || (params.header) || (params.heading)) {
        // if they pass alternate names, set to 'head'
        if (params.header) { params.head = params.header; }
        if (params.heading) { params.head = params.heading; }
        // set the value 
        head = params.head;
      }
      // also accept 'image'
      if ((params.img) || (params.image)) {
        // if they pass 'image', set to 'img' instead
        if (params.image) { params.img = params.image; }
        // if user is requesting 'gears', do nothing... 
        // gears is the default image
        if (params.img === 'gears') {
          log('Using spinner image: gears','dev');
        }
        // if the user is requesting 'blocks' image
        if (params.img === 'blocks') {
          log('Using spinner image: blocks','dev');
          img = 'blocks'; // load the blocks image
        }
      }
      // also accept 'message'
      if ((params.msg) || (params.message)) {
        // if they pass 'message', set to 'msg' instead
        if (params.message) { params.msg = params.message };
        log('Using spinner message: ' + params.msg,'dev');
        msg = params.msg;
      } else {
        msg = `Spinner message with ${img} image`;
      }
      // create a new sample spinner object
      var ssob = {
        "head": head,
        "img": img,
        "msg": msg
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
          log('Showing Error','api');     
          // create test error object
          let error = { 
            "title":"This is a Title!", 
            "cause":"This describes the cause of the problem", 
            "solution":"These are some possible solutions to fix the problem" 
          };
          // if we have url parameters, use those instead
          if (params.title) { error.title = params.title; }
          if (params.cause) { error.cause = params.cause; }
          if (params.solution) { error.solution = params.solution; }
          // load the error template
          loadErrorTemplate();
          // display the error
          showError(error);
          //outputData('The Error template would appear on the index page with this API request');
          break;
    // IFRAME
    case 'iframe':
        // make sure UI is visible
        ui.style.display = 'block';
        // if they're passing an iframe src (url), load it
        if (params.src) { loadIframeTemplate(params.src); }
        // if no iframe URL is passed, load the gray page
        else { loadIframeTemplate(); }
        break;
    // DEFAULT
    default:
      // no match found, show an error
      loadErrorTemplate();
      let themessage = `The template you requested ('${params.tpl}') doesn't exist`;
      let errormsg = {
        "title": "Template Not Found",
        "cause": themessage,
        "solution": "Make sure that you are requesting a valid template"
      };
      showError(errormsg);
      log(themessage,'error');
  }
}

// ======================================================================================
// JSON DATA: modify the User Interface (UI) by passing JSON data
// 
// TWO METHODS:
// 
// 1. Pass JSON directly in the URL (minified and URI-encoded):
// Example: /?json=%7B%22tpl%22:%22spinner%22,%22width%22:%22700%22,%22height%22:%22250%22,%22header%22:%22This%20Is%20A%20Sample%20Heading%22,%22image%22:%22gears%22,%22message%22:%22This%20is%20A%20Sample%20Status%20Message%22%7D
//
// 2. Pass the path to a JSON file (already on the server):
// Example 1: /?json=/sae/lib/json/test/blocks-sample.json
// Example 2: /?json=/sae/lib/json/test/gears-sample.json
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
  if (cldata.startsWith("{")) { 

    log('User is passing JSON directly via URL','dev');

    // parse the data
    let pd = JSON.parse(cldata);

    // if we have parsed data...
    if (pd) {

      // figure out which template to show
      switch (pd.tpl) {

        case 'logo':
            loadLogoTemplate();
            // fadeout spin uses separate function to prevent a flicker effect
            if (pd.sfx === 'fadeoutspin') { fadeOutSpinLogo(); }
            // otherwise, pass data to the showLogo() function
            else { showLogo(pd.sfx); }
        break;

        case 'spinner':
            // load the spinner template
            loadSpinnerTemplate();
            // create spinner object
            let spo = {
              "head":"Sample Header",
              "img":"gears",
              "msg":"This is a sample message"
            };
            // set object values to user input (if any)
            if (pd.head) { spo.head = pd.head; }
            if (pd.img) { spo.img = pd.img; }
            if (pd.msg) { spo.msg = pd.msg; }
            // try to render the spinner object
            showSpinner(spo);
        break;
          
        case 'error':
            loadErrorTemplate();
            // create an error object
            let errob = {
              "title":"Sample Error Title",
              "cause":"This is what caused the problem",
              "solution":"These are some steps you can take to try to fix the problem"
            };
            // set object values to user input (if any)
            if (pd.title) { errob.title = pd.title; }
            if (pd.cause) { errob.cause = pd.cause; }
            if (pd.solution) { errob.solution = pd.solution; }
            // try to render error object
            showError(errob);
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

// process JSON data (used by Method 2)
export function processResults(data) {
  // if we have data...
  if (data) {
    // figure out which template to load
    switch (data.tpl) {

      case 'logo':
            // load the logo template
            loadLogoTemplate();
            // fadeout spin uses separate function to prevent a flicker effect
            if (data.sfx === 'fadeoutspin') { fadeOutSpinLogo(); }
            // otherwise, pass data to the showLogo() function
            else { showLogo(data.sfx); }
          break;

      case 'spinner':
            // load the spinner template
            loadSpinnerTemplate();
            // pass data to the showSpinner() function
            showSpinner(data);
          break;
          
      case 'error':
            // load the error template
            loadErrorTemplate();
            // pass data to the showError() function
            showError(data);
          break;

      default: 
        log(`JSON file contains an invalid template request: "${data.tpl}"`,'error');          
    
    }    
  }
}

// -----------------------------------------------------------------
// DEV USE: Test Options
// These features and options are not used (or seen) by end-users
// -----------------------------------------------------------------

// TURN DEV MODE ON: /?devmode=true or /?devmode=on
if ((params.devmode === 'true') || (params.devmode === 'on')) { 
  // set a flag in localstorage
  localStorage.setItem('devmode', true);
  // turn dev mode on
  devModeOn();  
}

// TURN DEV MODE OFF: /?devmode=false or /?devmode=off
if ((params.devmode === 'false') || (params.devmode === 'off')) { 
  // remove the flag from localstorage
  localStorage.removeItem('devmode');
  // turn dev mode off
  devModeOff();
}

// generate some test data: /sae/?test=true
if (params.test === 'true') { 
    // create some test data
    let nobj = {
        "name": "Foobar Industries, Inc.",
        "ceo": "Joe Tester",
        "url": "https://foobar.com",
        "id": "0123456789",
        "phone": "1-800-123-4567",
        "date": tstamp()  // timestamp in JSON format
    };
    loadLogoTemplate();
    showLogo('spin');
    // show info to the user
    log(`Request type is: "TEST" —> Key is: "${params.test}"`,'api');
    console.log('Test object: ', nobj);
}

// dump localstorage keys to a JSON file
if (params.dump === 'true') {
  // load the spinner template
  loadSpinnerTemplate();
  // create a spinner object
  let spo = {
    "width": 450, 
    "height": "",
    "head": "Dumping Localstorage",
    "img": "gears",
    "msg": "Dumping localstorage data to a JSON file"
  };
  // show the spinner
  showSpinner(spo);
  // save localstorage keys
  var dump = Object.entries(localStorage);
  // and push a JSON file download to the user
  dumpStorageToJson(solbackfile, dump); 
  // then, redirect to basedir after 2 seconds
  setTimeout(function(){ location.href = basedir; }, 2000);
}

// TODO: need to rework this whole thing.... need to have 'targdiv' value from localstorage!
// ------------------------------------------------------------------------------------------------------
// Output HTML - viewable at: /api/index.html or /api/
// Displays API data to a page element (target div = 'display')
//
// To jump directly to named anchor on the page, use hashtag '#output' at the end of the url
// Example: /sae/api/?test=true#output
// 
// -------------------------------------------------------------------------------------------------------
export function outputData(obj) {
  // only attempt HTML output if we're on /api/ page
  //if (pageIsAPI()) {
    // is it really an object?
    //if (isObject(obj)) {
        // output to target div
        //display.innerHTML = `<span id="objtext" class="optxt">JSON Object:<br>${JSON.stringify(obj)}</span>`;
        //console.log('We have an object: ', obj);
    //} else {
        // not an object (e.g. string or number)
        // output to target div
        //display.innerHTML = `<span id="strtext" class="optxt">${obj}</span>`;
        //console.log('Non-Object: ', obj);
        //console.log('Type: ' + typeof(obj));
    //}
    // show console data and message
    console.log('Object: ', obj);
    //log('Go to: /sae/api/?key=value to see HTML output','api');
}
// TODO: after outputData is reworked, we need to redo this function too....
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

// Show API version:
//
// if verbose logging is true, 
if (verbose) {
  // see if bootmsg flag is true
  let shown = getSaved({"key":"bootmsg"});
  // if not, show version number, and set bootmsg flag to true
  if (!shown) { log(`version ${apiver}`,'api'); }
}