/* -----------------------------------------

      Sternberg Task, each execution represents an average adult
  
      command line argument: # of trials

      node wm.js 54

----------------------------------------- */

var numTrials = 0;
var numTrialsSum = 0;

if (!isNaN(+process.argv[2]))
    numTrials = +process.argv[2];


var trials = [];

var wm_Limit = getRandomNumber(5, 9); // side note: every hundred trials, limit increases by 1?

var symbols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//var symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

// -----------------------------------------

if (numTrials == 0) {
    console.log("\n      Many researchers of memory believe that there exists a short-term memory (STM) system that holds information for a few seconds. If the information in STM is not transferred to long term memory (LTM) for more permanent storage, it vanishes. As evidence of the existence of STM grew, researchers started to explore its properties. In a series of articles starting in 1966, Saul Sternberg developed an experimental approach to explore how information was retrieved from STM.");
    console.log("\n      The basic approach is simple. Participants were shown a short (1 to 6 items) list of numbers and asked to memorize them. After putting them to memory, a probe number was shown. The probe number was either one of the numbers in the list or a new number. The participant was to respond as quickly as possible, indicating whether the probe number was in the list or not. The response time of the participant should reflect the time spent searching STM to determine whether the probe number is part of the list. By varying the number of items in the list, Sternberg hypothesized that he could test several theories of STM search.");

    console.log("\n Run the commmand:   node wm.js numTrials\n");
} else {
    setup();
    printTrials();
    printStats();
}

// -----------------------------------------

function setup() {

    var currTrial = 1;

    while (currTrial <= numTrials) {

        var memorySet = generateList();

        //console.log(memorySet);

        var probe;

        var probeProb = getRandomNumber(0, 3);

        if (probeProb == 0)
            probe = memorySet[getRandomNumber(0, memorySet.length - 1)];
        else
            probe = symbols[getRandomNumber(0, symbols.length - 1)];


        //console.log(probe);

        sternbergTask(currTrial, memorySet, probe);

        currTrial += 1;
    }
}

function sternbergTask(currTrial, memorySet, probe) {

    // Participant is shown a short (one to six items) list of numbers and asked to memorize them.

    var wm = memorizeSymbols(memorySet);

    // After putting the list to memory, a probe number is shown. The probe number is either 
    // one of the numbers in the list or a new number. The participant has to respond as quickly 
    // as possible, indicating whether the probe number was in the list or not. yes or no.

    var pResponse = seeProbeAndRespond(wm, probe);

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

    trials.push(trial);


}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function generateList() {

    var length = getRandomNumber(2, 6);

    var symbolsCopy = symbols.slice();
    var indices = [];
    var tempList = [];

    if (symbolsCopy.length < length) {
        console.log("Symbol set too small. Duplicating symbols to fill.")
        var tempLength = symbolsCopy.length;
        var multiplier = tempLength * Math.ceil((1.0 * length) / symbolsCopy.length);

        for (var x = 0; x < multiplier; x++) {

            symbolsCopy.push(symbolsCopy[x % tempLength]);
        }
    }

    for (var j = 0; j < length; j++) {
        indices.push(j);
        tempList.push(symbolsCopy[0]);
    }

    for (var i = 0; i < length; i++) {

        var randSymbSeed = getRandomNumber(0, symbolsCopy.length - 1);
        var randIndSeed = getRandomNumber(0, indices.length - 1);

        tempList[indices[randIndSeed]] = symbolsCopy[randSymbSeed];


        symbolsCopy.splice(randSymbSeed, 1);
        indices.splice(randIndSeed, 1);
    }

    return tempList;
}

function memorizeSymbols(memorySet) {

    var tempWM = [];

    for (var i = 0; i < memorySet.length; i++) {

        tempWM.unshift(memorySet[i]);

        if (i >= wm_Limit)
            tempWM.pop();
    }

    return tempWM;
}

function seeProbeAndRespond(wm, probe) {

    var r = false, rt = 0.0;

    for (var i = 0; i < wm.length; i++) {

        if (wm[i] == probe)
            r = true;

        rt += getRandomFloat(34.1, 41.7); // in milliseconds (ms)
    }

    var pResponse = { response: r, responseTime: parseFloat(rt.toFixed(2)) };

    return pResponse;
}

function validateResponse(memorySet, probe, pResponse) {

    var correctAnswer = false;

    for (var i = 0; i < memorySet.length; i++) {

        if (memorySet[i] == probe)
            correctAnswer = true;
    }

    if (pResponse === correctAnswer)
        return true;
    else
        return false;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function printTrials() {

    for (var i = 0; i < trials.length; i++) {

        //for (variable in object) {
        //}

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

function printStats() {

    console.log("------------------------------------------------------------");
    console.log("------------------------------------------------------------\n");

    //numTrialsSum += trials.length;

    var numYes = 0;
    var numCorrect = 0;

    var frequencies = {};

    for (var i = 0; i < trials.length; i++) {

        //for (variable in object) {
        //}

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