// ----------------------------------------------------------
// dev-spinner-sequence-function.js - Dev Use Only
//
// spinner sequence functions
//
// allow you to create a sequence of spinners with
// adustable timeouts (which can be different from 'delay' in variables.js)
//
// minimum number of frames in a sequence: 2
// maximum number of frames in a sequence: 5
// -----------------------------------------------------------
//
// DEV USE:
import { delay } from "/sae/lib/js/modules/variables.js";
import { tstamp, isoStringToDate, diffDatesInSecs } from "/sae/lib/js/modules/functions.js";
import { log } from "/sae/lib/js/modules/logger.js";
import { 
    loadSpinnerTemplate, 
    showSpinner,
    hideSpinner
} from "/sae/lib/js/modules/ui.js";

// DEV USE:

// create a variable for 'sequence delay' 
var sqdel = '';

// create a new sequence object 
let seqobj = {
	"delay": "2500",    
	"spinobj": [
       {
			"header": "Test Header One",
            "width": "",
            "height": "",
			"image": "blocks",
			"message": "Test message for spinner one",
            "timeout": ""
		},
		{
			"header": "Test Header Two",
            "width": "",
            "height": "",            
			"image": "gears",
			"message": "Test message for spinner two",
            "timeout": ""            
		},
		{
			"header": "Test Header Three",
            "width": "",
            "height": "",            
			"image": "blocks",
			"message": "Test message for spinner three",
            "timeout": ""            
		}, 
        {
			"header": "Test Header Four",
            "width": "",
            "height": "",
			"image": "blocks",
			"message": "Test message for spinner four",
            "timeout": ""
		},
		{
			"header": "Test Header Five",
            "width": "",
            "height": "",            
			"image": "gears",
			"message": "Test message for spinner five",
            "timeout": ""            
		}                      
	]
};

// pass to the function
spinnerSequence(seqobj);

// DEV USE:
// Spinner Sequence
// run a series of messages with timeouts... daisy-chained together
// accepts 1 argument: sequence object (see above)
//
export function spinnerSequence(seqobj) {

    // if we don't have a sequence object, show an error
    if (!seqobj) { log('You did not pass a valid sequence object to the spinnerSequence() function','error'); }

    // otherwise,
    else { 

        // figure out how many spin objects we're running in this sequence
        let count = seqobj.spinobj.length;

        // if user doesn't provide a seqobj delay, or the value is empty
        // use default delay value from variables.js
        if ((!seqobj.delay) || (seqobj.delay == ' ')) { seqobj.delay = delay };

        // update our sequence delay variable
        sqdel = seqobj.delay;

        // TODO: this will eventually check inside each spin obj for 'timeout' property (not implemented yet!)
        // TODO: this will allow user to adjust timing per screen rather than having one delay time for all
        // TODO: but, for now, we're only using the master 'seqobj.delay' value for timeouts

        // DEV USE:
        // console.log("Sequence Object is: ", seqobj);
        // console.log('Sequence Count is: ' + count);
        // console.log('Sequence Object delay is: ' + seqobj.delay);

        // if the number of spinner objects is more than 5, show an error
        if (count > 5) { log('The maximum limit for a sequence of spinners is 5!', 'error'); }

        // otherwise,
        else {

            // if the count is greater than 0 and less than or equal to 5...
            if ((count > 0) && (count <= 5)) {

                // load the spinner template
                loadSpinnerTemplate();

                // create a 'spinner sequence count' object
                var sscount = {
                    "starttime": tstamp(),      // start time
                    "endtime": "",              // end time
                    "delay": sqdel,             // sequence object delay
                    "total": count,             // number of items in sequence
                    "position": 0,              // current position in the sequence
                    "remaining": count,         // remaining number of items to process
                    "completed": 0,             // number of spinners completed
                    "sequence": seqobj.spinobj  // the array of spinner objects 
                };

                // save value to localstorage
                localStorage.setItem('sscount', JSON.stringify(sscount));

                // DEV USE:
                //console.log('Value is: ', seqobj.spinobj[0]);

                // Load the first frame of the sequence (passing the first spinner object)
                loadFrameOne(seqobj.spinobj[0]);

            }
            // otherwise, show an error and tell them to RTFM
            else {
                log(`The spinnerSequence() function expects a valid 'sequence object' containing 1-5 'spin objects' and a delay time`,'error');
                log('Please read the documentation for the spinnerSequence() function', 'yellow');
            }
        }
    }
}

// ----------------------------------------
// CASCADING FUNCTIONS:
// ----------------------------------------

// Load Frame 1
function loadFrameOne(spinobj) {
	// if empty, show an error
    if (!spinobj) { log(`You didn't pass a spinner object`,'error'); return false; }
    // logging 
    log('Kicking off the spinner sequence...','dev');
    log('Spinner 1','dev');      
	// pass the spin object to showSpinner() function
	showSpinner(spinobj);
	// then, after a delay...
	setTimeout(function(){ 
        // hide the spinner
		hideSpinner();           
        // adjust the count, passing next frame as callback
        adjustCount(loadFrameTwo);
	}, sqdel);
}	

// Load Frame 2
function loadFrameTwo(spinobj) {
	// if empty, show an error
    if (!spinobj) { log(`You didn't pass a spinner object`,'error'); return false; }
    // logging
    log('Spinner 2','dev');     
	// pass object to showSpinner()
	showSpinner(spinobj);
	// then, after a delay...
	setTimeout(function(){ 
        // hide the spinner
		hideSpinner();     
        // adjust the count, passing next frame as callback
		adjustCount(loadFrameThree);
	}, sqdel);
}	
// Load Frame 3
function loadFrameThree(spinobj) {
	// if empty, show an error
    if (!spinobj) { log(`You didn't pass a spinner object`,'error'); return false; }
    // logging
    log('Spinner 3','dev');   
	// pass object to showSpinner()
	showSpinner(spinobj);
	// then, after a delay...
	setTimeout(function(){ 
		hideSpinner();      // hide the spinner         
        // adjust the count, passing next frame as callback
		adjustCount(loadFrameFour);
	}, sqdel);
}	

// Load Frame 4
function loadFrameFour(spinobj) {
	// if empty, show an error
    if (!spinobj) { log(`You didn't pass a spinner object`,'error'); return false; }
    // logging
    log('Spinner 4','dev');     
	// pass object to showSpinner()
	showSpinner(spinobj);
	// then, after a delay...
	setTimeout(function(){ 
		hideSpinner();       // hide the spinner        
        // adjust the count, passing next frame as callback
		adjustCount(loadFrameFive);
	}, sqdel);
}	

// Frame 5
function loadFrameFive(spinobj) {
	// if empty, show an error
    if (!spinobj) { log(`You didn't pass a spinner object`,'error'); return false; }
    // logging
    log('Spinner 5','dev');    
	// pass object to showSpinner()
	showSpinner(spinobj);
	// then, after a delay...
	setTimeout(function() { 
        // hide the spinner
		hideSpinner();       	
        // add the final timestamp
        addEndTime();        
        // calculate time 
        calculateTimeDiff();	
	}, sqdel);
}

// returns current position in the sequence (0-4)
function getSeqTotal() {
    let sc = localStorage.getItem('sscount');
    if (sc) {
        let data = JSON.parse(sc);
        return data.items;
    }
}

// returns current position in the sequence (0-4)
function getSeqPosition() {
    let sc = localStorage.getItem('sscount');
    if (sc) {
        let data = JSON.parse(sc);
        return data.position;
    }
}

// returns the number of remaining items to display
function getSeqRemain() {
    let sc = localStorage.getItem('sscount');
    if (sc) {
        let data = JSON.parse(sc);
        return data.remaining;
    }    
}

// returns the number of completed items
function getSeqComplete() {
    let sc = localStorage.getItem('sscount');
    if (sc) {
        let data = JSON.parse(sc);
        return data.completed;
    }    
}

// increment position and completed
// decrement remaining 
function adjustCount(cback) {
    // get the spinner sequence count from localstorage
    let ssc = localStorage.getItem('sscount');
    if (ssc) {
        // if we have saved data, parse it...
        let data = JSON.parse(ssc);

        // update some of the vars
        let newpos = data.position + 1;
        let newcom = data.completed + 1;
        let newrem = data.remaining - 1;

        // create a new sscount obj
        let sscobj = {
            "starttime": data.starttime,    // start time
            "endtime": "",                  // end time
            "delay": data.delay,            // sequence object delay
            "total": data.total,            // number of items in sequence
            "position": newpos,             // add one to the current position
            "remaining": newrem,            // subtract one from remaining number of items
            "completed": newcom,            // add one to the number of spinners completed
            "sequence": seqobj.spinobj      // the array of spinner objects             
        }; 

        // and write to localStorage
        localStorage.setItem('sscount', JSON.stringify(sscobj));

        // call the cback function, passing next spin object
        cback(data.sequence[newpos]);
    } 
}

function addEndTime() {
    // get the spinner sequence count from localstorage
    let ssc = localStorage.getItem('sscount');
    if (ssc) {
        // if we have saved data, parse it...
        let data = JSON.parse(ssc);
        // create a new sscount obj
        let sscobj = {
            "starttime": data.starttime,    // start time
            "endtime": tstamp(),            // add end timestamp
            "delay": data.delay,            // sequence object delay
            "total": data.total,            // number of items in sequence
            "position": data.position,      // position is total - 1
            "remaining": 0,                 // no items remaining
            "completed": data.total,        // all items completed
            "sequence": data.sequence       // the array of spinner objects             
        }; 
        // and write to localStorage
        localStorage.setItem('sscount', JSON.stringify(sscobj));            
    }
}

function calculateTimeDiff() {
  // get the spinner sequence count from localstorage
  let ssc = localStorage.getItem('sscount');
  if (ssc) {
        // if we have saved data, parse it...
        let data = JSON.parse(ssc); 
        let start = isoStringToDate(data.starttime);
        let end = isoStringToDate(data.endtime);
        let totaltime = diffDatesInSecs(start,end);
        log('Elapsed sequence time: ' + totaltime + ' seconds','dev');
  }    
}