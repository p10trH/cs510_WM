/* -----------------------------------------

      Sternberg Task, each execution represents an average adult
  
      command line argument: # of trials

      node wm.js 54

----------------------------------------- */

var numTrials = 0; // number of trials to run

if (!isNaN(+process.argv[2])) // check if command-line argument is present
    numTrials = +process.argv[2]; // if yes, set numbr of trials to run

var trials = []; // stores all trials

// side note: every hundredish trials, limit increases by 1?
// magic 7 plus-or-minus 2, the limit of an average working memory
var wm_Limit = getRandomNumber(5, 9);

// the symbols to use for the trials, original experiment used digits
// however, this script supports other symbol sets
var symbols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//var symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

// -----------------------------------------

if (numTrials == 0) { // if number of trials wasn't specified, print intro and directions
    console.log("\n      Many researchers of memory believe that there exists a short-term memory (STM) system that holds information for a few seconds. If the information in STM is not transferred to long term memory (LTM) for more permanent storage, it vanishes. As evidence of the existence of STM grew, researchers started to explore its properties. In a series of articles starting in 1966, Saul Sternberg developed an experimental approach to explore how information was retrieved from STM.");
    console.log("\n      The basic approach is simple. Participants were shown a short (1 to 6 items) list of numbers and asked to memorize them. After putting them to memory, a probe number was shown. The probe number was either one of the numbers in the list or a new number. The participant was to respond as quickly as possible, indicating whether the probe number was in the list or not. The response time of the participant should reflect the time spent searching STM to determine whether the probe number is part of the list. By varying the number of items in the list, Sternberg hypothesized that he could test several theories of STM search.");

    console.log("\n Run the commmand:   node wm.js numTrials\n");
} else { // else setup the experiment, run the trials, and print the data
    setup();
    printTrials();
    printStats();
}

// -----------------------------------------

function setup() { // used to generate memory sets and run the task

    var currTrial = 1; // keep track of trials

    while (currTrial <= numTrials) { // run trials 

        var memorySet = generateList(); // generate memory set

        var probe;

        // extra step to make sure probe has a 50/50 chance of being in the memory set

        var probeProb = getRandomNumber(0, 3);

        if (probeProb == 0)
            probe = memorySet[getRandomNumber(0, memorySet.length - 1)];
        else
            probe = symbols[getRandomNumber(0, symbols.length - 1)];

        // run Sternberg Task
        // pass the current trial number, the memory set, and the probe
        sternbergTask(currTrial, memorySet, probe);

        currTrial += 1; // increase trial number, needed for while loop
    }
}

// THE STERBERG TASK
function sternbergTask(currTrial, memorySet, probe) {

    // Participant is shown a short (one to six items) list of numbers and asked to memorize them.
    // The list of numbers is stored in working memory

    var wm = memorizeSymbols(memorySet);

    // After putting the list to memory, a probe number is shown. The probe number is either 
    // one of the numbers in the list or a new number. The participant has to respond as quickly 
    // as possible, indicating whether the probe number was in the list or not. yes or no.

    var pResponse = seeProbeAndRespond(wm, probe);

    // validate the user's response to see if the probe was actually in the memory set or not

    var isCorrect = validateResponse(memorySet, probe, pResponse.response);

    // record and store trial

    var trial = {
        trialNumber: currTrial,
        memorySet: memorySet,
        probe: probe,
        wm: wm,
        wm_Limit: wm_Limit,
        pRes: pResponse.response,
        pResTime: pResponse.responseTime,
        isCorrect: isCorrect
    };

    trials.push(trial); // add trial to list of trials
}

function getRandomNumber(min, max) { // function used to generate random whole numbers
    min = Math.ceil(min);
    max = Math.floor(max);

    // the maximum is inclusive and the minimum is inclusive
    
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function generateList() { // function used to generate memory sets similar to original experiments

    var length = getRandomNumber(2, 6); // list length is between 2 and 6

    var symbolsCopy = symbols.slice(); // get a copy of the symbol set
    var indices = [];
    var tempList = []; // temporary list, that will be filled and returned

    if (symbolsCopy.length < length) { // safety check if symbol list is shorter than the list length
        console.log("Symbol set too small. Duplicating symbols to fill.")
        var tempLength = symbolsCopy.length;
        var multiplier = tempLength * Math.ceil((1.0 * length) / symbolsCopy.length);

        for (var x = 0; x < multiplier; x++) {

            symbolsCopy.push(symbolsCopy[x % tempLength]);
        }
    }

    for (var j = 0; j < length; j++) { // fill indices, used later for random order
        indices.push(j);
        tempList.push(symbolsCopy[0]);
    }

    for (var i = 0; i < length; i++) { // fill temporary list to return

        var randSymbSeed = getRandomNumber(0, symbolsCopy.length - 1); // get random symbol
        var randIndSeed = getRandomNumber(0, indices.length - 1); // get random index

        // fill memory set with random symbol at random index
        tempList[indices[randIndSeed]] = symbolsCopy[randSymbSeed];

        // delete the symbol and index already used to fill memory set
        symbolsCopy.splice(randSymbSeed, 1);
        indices.splice(randIndSeed, 1);
    }

    // return the temporary list, which is the final memory set for the current trial
    return tempList;
}

// function part of the model, user needs to memorize memory set
// coded to reflect how a human stores symbols in working memory
function memorizeSymbols(memorySet) {

    var tempWM = []; // working memory

    // user sees one symbol at a time and stores it in working memory
    for (var i = 0; i < memorySet.length; i++) {

        // new symbol is placed in beginning of working memory,
        // shifting older symbols to the right

        tempWM.unshift(memorySet[i]);

        // if working memory limit is reached, then oldest symbol
        // to the right gets deleted, just like a human

        if (i >= wm_Limit)
            tempWM.pop();
    }

    return tempWM; // return the working memory set
}

// function part of the model, user needs to see the probe and respond
function seeProbeAndRespond(wm, probe) {

    var r = false, rt = 0.0; // r = response, rt = response time

    // search is done in serial
    // search is exhaustive

    for (var i = 0; i < wm.length; i++) { // check WM for probe

        if (wm[i] == probe) // if found, response will be true
            r = true;

        // response time is increased for every symbol added to memory set.
        // these numbers are derived from the original experiment
        // average response time was 38 ms per symbol added

        rt += getRandomFloat(34.1, 41.7); // in milliseconds (ms)
    }

    // store the user's response and response time
    var pResponse = { response: r, responseTime: parseFloat(rt.toFixed(2)) };

    return pResponse; // return the response
}

// function used to validate user's response.
// was probe part of memory set?
function validateResponse(memorySet, probe, pResponse) {

    var correctAnswer = false;

    for (var i = 0; i < memorySet.length; i++) {

        if (memorySet[i] == probe)
            correctAnswer = true;
    }

    if (pResponse === correctAnswer) // check if user answered correctly
        return true;
    else
        return false;
}

// function used to generate random float numbers
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// function used to print each trial and the respective data
function printTrials() {

    for (var i = 0; i < trials.length; i++) {

        console.log("------------------------------------------------------------\n");
        console.log(" Trial: ", trials[i].trialNumber);
        console.log("");
        console.log(" M Set: ", trials[i].memorySet, " Probe: ", trials[i].probe);
        console.log("\n - Step 1: Memorize list of symbols. -\n");
        console.log("   WM: ", trials[i].wm, " WM Limit: ", trials[i].wm_Limit);
        console.log("\n - Step 2: Probe is shown, response recorded. -\n");
        console.log("   Response: ", trials[i].pRes, " RT: ", trials[i].pResTime, " ms\n");
        console.log("   Was response correct?: ", trials[i].isCorrect);

        console.log("");
    }
}

// function used to print stats once all trials are completed
function printStats() {

    console.log("------------------------------------------------------------");
    console.log("------------------------------------------------------------\n");

    var numYes = 0;
    var numCorrect = 0;

    var frequencies = {};

    for (var i = 0; i < trials.length; i++) {

        // how many "true" (yes) responses -----> show pie chart
        // how many "false" (no) responses
        if (trials[i].pRes == true)
            numYes += 1;

        // how many correct responses -----> show pie chart
        // how many incorrect reponses
        if (trials[i].isCorrect == true)
            numCorrect += 1;

        // average response time for each list length -----> show table or two bar charts "2 : 5 times : 34 ms"
        // and the frequency each memory set length shows up in trials
        var setLength = trials[i].memorySet.length;
        if (!frequencies.hasOwnProperty(setLength)) {
            frequencies[setLength] = { freq: 1, sum: trials[i].pResTime, aveResTime: trials[i].pResTime };
        }
        else {
            frequencies[setLength].freq += 1;
            frequencies[setLength].sum = parseFloat((frequencies[setLength].sum + trials[i].pResTime).toFixed(2));
            frequencies[setLength].aveResTime = parseFloat((frequencies[setLength].sum / frequencies[setLength].freq).toFixed(2));
        }

        // plot graph with all trials (list length VS response time), color by correctness of response
        // place incorrect colored points on top since less of them
        // extra: highlighing table entry highlights point in plot, and vice versa
    }

    console.log(" Total amount of trials: ", trials.length);

    console.log("\n     # of 'yes' responses: ", numYes, "      # of 'no' responses: ", trials.length - numYes);
    console.log("\n     # of correct responses: ", numCorrect, "   # of incorrect responses: ", trials.length - numCorrect);

    //console.log(frequencies);
    console.log("");

    for (var f in frequencies) {
        console.log("     set length: ", f, "     freq: ", frequencies[f].freq, "     average RT: ", frequencies[f].aveResTime);
    }

    console.log("");
}