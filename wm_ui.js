/* -----------------------------------------

      Sternberg Task, each execution represents an average adult
  
      command line argument: # of trials

      node wm.js 54

----------------------------------------- */

var numTrials = 0;

var trialID = 1;

//if (!isNaN(+process.argv[2]))
//    numTrials = +process.argv[2];


var trials = [];

var wm_Limit = getRandomNumber(5, 9); // side note: every hundred trials, limit increases by 1?

var symbols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//var symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

// -----------------------------------------

//prepare();
//printTrials();
//printStats();

// -----------------------------------------

function prepare() {

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
        isCorrect: isCorrect,
        trialID: (trialID++)
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

    var r = false,
        rt = 0.0;

    for (var i = 0; i < wm.length; i++) {

        if (wm[i] == probe)
            r = true;

        rt += getRandomFloat(34.1, 41.7); // in milliseconds (ms)
    }

    var pResponse = {
        response: r,
        responseTime: parseFloat(rt.toFixed(2))
    };

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

    var tempTable = document.getElementById("trialTable");

    while (tempTable.rows.length > 0) {
        tempTable.deleteRow(0);
    }

    var tHeader = tempTable.createTHead();

    var tRow = tHeader.insertRow(-1);
    //var tRow = tempTable.insertRow(-1);

    var tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>ID</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>Trial #</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>Memory Set</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>Probe</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>Working Memory</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>WM Limit</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>Response</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>R. Time (ms)</b>";

    tCell = tRow.insertCell(-1);
    tCell.innerHTML = "<b>Correct</b>";

    for (var i = 0; i < trials.length; i++) {

        tRow = tempTable.insertRow(-1);


        tCell = tRow.insertCell(-1);
        tCell.innerHTML = trials[i].trialID;

        tCell = tRow.insertCell(-1);
        tCell.innerHTML = trials[i].trialNumber;

        tCell = tRow.insertCell(-1);

        if (trials[i].memorySet.length == 2) {
            tCell.style["background-color"] = "#9ecae1";
        } else if (trials[i].memorySet.length == 3) {
            tCell.style["background-color"] = "#6baed6";
        } else if (trials[i].memorySet.length == 4) {
            tCell.style["background-color"] = "#4292c6";
        } else if (trials[i].memorySet.length == 5) {
            tCell.style["background-color"] = "#2171b5";
        } else if (trials[i].memorySet.length == 6) {
            tCell.style["background-color"] = "#08519c";
        }


        tCell.innerHTML = trials[i].memorySet;

        tCell = tRow.insertCell(-1);
        tCell.innerHTML = trials[i].probe;

        tCell = tRow.insertCell(-1);


        if (trials[i].wm.length == 2) {
            tCell.style["background-color"] = "#9ecae1";
        } else if (trials[i].wm.length == 3) {
            tCell.style["background-color"] = "#6baed6";
        } else if (trials[i].wm.length == 4) {
            tCell.style["background-color"] = "#4292c6";
        } else if (trials[i].wm.length == 5) {
            tCell.style["background-color"] = "#2171b5";
        } else if (trials[i].wm.length == 6) {
            tCell.style["background-color"] = "#08519c";
        }


        tCell.innerHTML = trials[i].wm;

        tCell = tRow.insertCell(-1);


        //        if (trials[i].wm_Limit == 5) {
        //            tCell.style["background-color"] = "#fdae6b";
        //        } else if (trials[i].wm_Limit == 6) {
        //            tCell.style["background-color"] = "#fd8d3c";
        //        } else if (trials[i].wm_Limit == 7) {
        //            tCell.style["background-color"] = "#f16913";
        //        } else if (trials[i].wm_Limit == 8) {
        //            tCell.style["background-color"] = "#d94801";
        //        } else if (trials[i].wm_Limit == 9) {
        //            tCell.style["background-color"] = "#a63603";
        //        }

        tCell.innerHTML = trials[i].wm_Limit;

        tCell = tRow.insertCell(-1);

        if (trials[i].pRes == true) {

            tCell.innerHTML = "Yes";
            tCell.style["background-color"] = "#489f4e"; //#9f4848", "#489f4e"
        } else {
            tCell.innerHTML = "No";
            tCell.style["background-color"] = "#9f4848";
        }


        tCell = tRow.insertCell(-1);
        tCell.innerHTML = trials[i].pResTime;

        tCell = tRow.insertCell(-1);

        if (trials[i].isCorrect == true) {

            tCell.style["background-color"] = "#489f4e"; //#9f4848", "#489f4e"
        } else {
            tCell.style["background-color"] = "#9f4848";
        }

        tCell.innerHTML = trials[i].isCorrect;

        //for (variable in object) {
        //}

        //        console.log("------------------------------------------------------------\n");
        //        console.log(" Trial: ", trials[i].trialNumber);
        //        console.log("");
        //        console.log(" M Set: ", trials[i].memorySet, " Probe: ", trials[i].probe);
        //        console.log("\n - Step 1: Memorize list of symbols. -\n");
        //        console.log("   WM: ", trials[i].wm, " WM Limit: ", trials[i].wm_Limit);
        //        console.log("\n - Step 2: Probe is shown, response recorded. -\n");
        //        console.log("   Response: ", trials[i].pRes, " RT: ", trials[i].pResTime, " ms\n");
        //        console.log("   Was response correct?: ", trials[i].isCorrect);

        //        console.log("");

    }

}

/////////
var svg;

svg = d3v3.select("#pie1")
    .append("svg")
    .append("g");

svg.append("g")
    .attr("class", "slices");
svg.append("g")
    .attr("class", "labels");
svg.append("g")
    .attr("class", "lines");

var width = 250,
    height = 275,
    radius = Math.min(width, height) / 3;

var pie = d3v3.layout.pie()
    .sort(null)
    .value(function (d) {
        return d.value;
    });

var arc = d3v3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

var outerArc = d3v3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

/////

var svg2;

svg2 = d3v3.select("#pie2")
    .append("svg")
    .append("g");

svg2.append("g")
    .attr("class", "slices");
svg2.append("g")
    .attr("class", "labels");
svg2.append("g")
    .attr("class", "lines");


svg2.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
/////

var key = function (d) {
    return d.data.label;
};

var color = d3v3.scale.ordinal()
    .domain(["No", "Yes", "False", "True"])
    .range(["#9f4848", "#489f4e", "#9f4848", "#489f4e"]);


//function randomData() {
//    var labels = color.domain();
//    return labels.map(function (label) {
//        return {
//            label: label,
//            value: Math.random()
//        }
//    });
//}



function change(data, svgEle) {

    /* ------- PIE SLICES -------*/
    var slice = svgEle.select(".slices").selectAll("path.slice")
        .data(pie(data), key);

    slice.enter()
        .insert("path")
        .style("fill", function (d) {
            return color(d.data.label);
        })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3v3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        })

    slice.exit()
        .remove();

    /* ------- TEXT LABELS -------*/

    if (data["0"].value == 0 || data["1"].value == 0)
        return;

    var text = svgEle.select(".labels").selectAll("text")
        .data(pie(data), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.label;
        });

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text.transition().duration(1000)
        .attrTween("transform", function (d) {
            this._current = this._current || d;
            var interpolate = d3v3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            var interpolate = d3v3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        });

    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svgEle.select(".lines").selectAll("polyline")
        .data(pie(data), key);

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function (d) {
            this._current = this._current || d;
            var interpolate = d3v3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
}

///////// bar charts

var alpha = "23456".split("");

var setup = d3.marcon()
    .element("#bar1")
    .top(20)
    .bottom(20)
    .left(10)
    .right(10)
    .width(250)
    .height(137);

setup.render();

var width = setup.innerWidth(),
    height = setup.innerHeight(),
    svg3 = setup.svg();

var x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(alpha)
    .padding(.1);

var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 10]);

var x_axis = d3.axisBottom(x);

var y_axis = d3.axisRight(y).tickSize(width);

svg3.append("g")
    .attr("class", "x axis").attr("transform", "translate(0," + height + ")")
    .call(x_axis);

svg3.append("g")
    .attr("class", "y axis")
    .call(customYAxis);

var color2 = d3.scaleOrdinal(["#66489f", "#66489f", "#66489f", "#66489f", "#66489f"]);
var color3 = d3.scaleOrdinal(["#9f4881", "#9f4881", "#9f4881", "#9f4881", "#9f4881"]);

//redraw(random_data());

//d3.interval(function () {
//    redraw(random_data());
//}, 1000);

function redraw(data) {
    var x_var = Object.keys(data[0])[0],
        y_var = Object.keys(data[0])[1];

    y_axis.tickFormat(function (d, i, ticks) {
        return i == ticks.length - 1 ? d + " " + y_var + "s" : d;
    });
    d3.select(".y.axis").call(customYAxis);

    // join
    var bar = svg3.selectAll(".bar")
        .data(data, function (d) {
            return d[x_var];
        });

    var amount = svg3.selectAll(".amount")
        .data(data, function (d) {
            return d[x_var];
        });

    // update
    bar
        .transition()
        .attr("y", function (d) {
            return y(d[y_var]);
        })
        .attr("height", function (d) {
            return height - y(d[y_var]);
        });

    amount
        .transition()
        .attr("y", function (d) {
            return y(d[y_var]);
        })
        .text(function (d) {
            return d[y_var];
        });

    // enter
    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d[x_var]);
        })
        .attr("y", function (d) {
            return y(d[y_var]);
        })
        //.attr("width", x.bandwidth())
        .attr("width", 40)
        .attr("height", function (d) {
            return height - y(d[y_var]);
        })
        .attr("fill", function (d) {
            return color2(d[x_var]);
        });

    amount.enter().append("text")
        .attr("class", "amount")
        .attr("x", function (d) {
            //return x(d[x_var]) + x.bandwidth() / 2;
            return x(d[x_var]) + 40 / 2;
        })
        .attr("y", function (d) {
            return y(d[y_var]);
        })
        .attr("dy", 16)
        .text(function (d) {
            return d[y_var];
        });

}

function customYAxis(g) {
    g.call(y_axis);
    g.select(".domain").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-width", "0");
    g.selectAll(".tick text").attr("x", 4).attr("dy", -4).remove();
}


/////////

///////// bar charts

//var alpha = "23456".split("");

var setup2 = d3.marcon()
    .element("#bar2")
    .top(20)
    .bottom(20)
    .left(10)
    .right(10)
    .width(250)
    .height(137);

setup2.render();

var svg4 = setup2.svg();

var y2 = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 10]);


svg4.append("g")
    .attr("class", "x axis").attr("transform", "translate(0," + height + ")")
    .call(x_axis);

svg4.append("g")
    .attr("class", "y axis")
    .call(customYAxis);

//redraw(random_data());

//d3.interval(function () {
//    redraw(random_data());
//}, 1000);

function redraw2(data) {
    var x_var = Object.keys(data[0])[0],
        y_var = Object.keys(data[0])[1];

    y_axis.tickFormat(function (d, i, ticks) {
        return i == ticks.length - 1 ? d + " " + y_var + "s" : d;
    });
    d3.select(".y2.axis").call(customYAxis);

    // join
    var bar = svg4.selectAll(".bar")
        .data(data, function (d) {
            return d[x_var];
        });

    var amount = svg4.selectAll(".amount")
        .data(data, function (d) {
            return d[x_var];
        });

    // update
    bar
        .transition()
        .attr("y", function (d) {
            return y2(d[y_var]);
        })
        .attr("height", function (d) {
            return height - y2(d[y_var]);
        });

    amount
        .transition()
        .attr("y", function (d) {
            return y2(d[y_var]);
        })
        .text(function (d) {
            return d[y_var];
        });

    // enter
    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d[x_var]);
        })
        .attr("y", function (d) {
            return y2(d[y_var]);
        })
        //.attr("width", x.bandwidth())
        .attr("width", 40)
        .attr("height", function (d) {
            return height - y2(d[y_var]);
        })
        .attr("fill", function (d) {
            return color3(d[x_var]);
        });

    amount.enter().append("text")
        .attr("class", "amount")
        .attr("x", function (d) {
            //return x(d[x_var]) + x.bandwidth() / 2;
            return x(d[x_var]) + 40 / 2;
        })
        .attr("y", function (d) {
            return y2(d[y_var]);
        })
        .attr("dy", 16)
        .text(function (d) {
            return d[y_var];
        });

}


/////

function randomData(samples) {
    var data = [],
        random = d3.randomNormal();

    for (i = 0; i < samples; i++) {
        data.push({
            x: random(),
            y: random()
        });
    }
    return data;
}

//var ds = randomData(200);
var ds = [{
    x: 2,
    y: 0.0
}, {
    x: 3,
    y: 250.0
}, {
    x: 4,
    y: 3.5
}, {
    x: 5,
    y: 10.34
}, {
    x: 6,
    y: 6.44
}];

for (var k = 0; k < 1000; k++) {
    ds.push({
        x: 5,
        y: 6.5
    });
}

var chart = "scatter";

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
};
var width5 = 250 - margin.left - margin.right,
    height5 = 275 - margin.top - margin.bottom;

var x5 = d3.scaleLinear()
    .range([0, width5]);

var y5 = d3.scaleLinear()
    .range([height5, 0]);

var xAxis = d3.axisBottom(x5).ticks(6),
    yAxis = d3.axisLeft(y5).ticks(12 * height5 / width5);

var svg5 = d3.select("#" + chart).append("svg")
    .attr("id", chart + "_svg")
    .attr("data-margin-right", margin.right)
    .attr("data-margin-left", margin.left)
    .attr("data-margin-top", margin.top)
    .attr("data-margin-bottom", margin.bottom)
    .attr("width", width5 + margin.left + margin.right)
    .attr("height", height5 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x5.domain(d3.extent(ds, function (d) {
    return d.x;
})).nice();
y5.domain(d3.extent(ds, function (d) {
    return d.y;
})).nice();

svg5.append("g")
    .attr("class", "x axis")
    .attr('id', "axis--x")
    .attr("transform", "translate(0," + height5 + ")")
    .call(xAxis);

svg5.append("g")
    .attr("class", "y axis")
    .attr('id', "axis--y")
    .call(yAxis);

svg5.selectAll(".dot")
    .data(ds)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 4)
    .attr("cx", function (d) {
        return x5(d.x);
    })
    .attr("cy", function (d) {
        return y5(d.y);
    })
    .attr("opacity", 0.5)
    .style("fill", "#4292c6");


//////

var maxFreq = 0;
var maxRT = 0.0;

function printStats() {

    //console.log("------------------------------------------------------------");
    //console.log("------------------------------------------------------------\n");

    //numTrialsSum += trials.length;

    var numYes = 0;
    var numCorrect = 0;

    var frequencies = {};

    var data = [];

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
            frequencies[setLength] = {
                freq: 1,
                sum: trials[i].pResTime,
                aveResTime: trials[i].pResTime
            };
        } else {
            frequencies[setLength].freq += 1;
            frequencies[setLength].sum = parseFloat((frequencies[setLength].sum + trials[i].pResTime).toFixed(2));
            frequencies[setLength].aveResTime = parseFloat((frequencies[setLength].sum / frequencies[setLength].freq).toFixed(2));
        }

        // plot graph with all trials (list length VS response time), color by correctness of response
        // place incorrect colored points on top since less of them
        // extra: highlighing table entry highlights point in plot, and vice versa



        data.push({
            x: trials[i].wm.length,
            y: trials[i].pResTime
        });

    }

    ////////

    //var labels = color.domain();
    var dataset = [
        {
            label: "No",
            value: (trials.length - numYes)
        },
        {
            label: "Yes",
            value: numYes
        }];

    change(dataset, svg);

    dataset = [
        {
            label: "False",
            value: (trials.length - numCorrect)
        },
        {
            label: "True",
            value: numCorrect
        }];

    change(dataset, svg2);


    var dataset2 = [];


    for (var f in frequencies) {

        if (frequencies[f].freq > maxFreq)
            maxFreq = frequencies[f].freq;



        dataset2.push({
            label: f,
            value: frequencies[f].freq
        });
        //console.log("     set length: ", f, "     freq: ", frequencies[f].freq, "     average RT: ", frequencies[f].aveResTime);
    }

    y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxFreq]);

    redraw(dataset2);

    //
    dataset2 = [];


    for (var f2 in frequencies) {

        if (frequencies[f2].aveResTime > maxRT)
            maxRT = frequencies[f2].aveResTime;



        dataset2.push({
            label: f2,
            value: frequencies[f2].aveResTime
        });
        //console.log("     set length: ", f, "     freq: ", frequencies[f].freq, "     average RT: ", frequencies[f].aveResTime);
    }

    y2 = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxRT]);

    redraw2(dataset2);

    //////


    updateScatter(data);


    ////////



    //console.log(" Total amount of trials: ", trials.length);

    //console.log("\n     # of 'yes' responses: ", numYes, "      # of 'no' responses: ", trials.length - numYes);
    //console.log("\n     # of correct responses: ", numCorrect, "   # of incorrect responses: ", trials.length - numCorrect);

    //console.log(frequencies);
    //console.log("");

    //for (var f in frequencies) {
    //        console.log("     set length: ", f, "     freq: ", frequencies[f].freq, "     average RT: ", frequencies[f].aveResTime);
    //}

    //console.log("");


}


function updateScatter(dataList) {

    var width = d3.select("#scatter_svg").attr("width") - d3.select("#scatter_svg").attr("data-margin-left") - d3.select("#scatter_svg").attr("data-margin-right"),
        height = d3.select("#scatter_svg").attr("height") - d3.select("#scatter_svg").attr("data-margin-top") - d3.select("#scatter_svg").attr("data-margin-bottom");

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x).ticks(12),
        yAxis = d3.axisLeft(y).ticks(12 * height / width);

    var ds = dataList;
    x.domain(d3.extent(ds, function (d) {
        return d.x;
    })).nice();
    y.domain(d3.extent(ds, function (d) {
        return d.y;
    })).nice();

    var t = svg5.transition().duration(750);
    svg5.select("#axis--x").transition(t).call(xAxis);
    svg5.select("#axis--y").transition(t).call(yAxis);
    svg5.selectAll(".dot").data(ds)
    svg5.selectAll("circle").transition(t)
        .attr("cx", function (d) {
            return x(d.x);
        })
        .attr("cy", function (d) {
            return y(d.y);
        });


}
