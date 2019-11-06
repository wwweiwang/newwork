"use-strict";

let data = "";
let svgContainer = ""; // keep SVG reference in global scope
//let popChartContainer = "";
let mapFunctions = "";
let legSelected = "All";
let genSelected = "All";

const msm = {
    width: 1000,
    height: 800,
    marginAll: 50,
    marginLeft: 50,
}

const colors = {
  "Bug": "#4E79A7",
  "Dark": "#A0CBE8",
  "Electric": "#F28E2B",
  "Fairy": "#FFBE&D",
  "Fighting": "#59A14F",
  "Fire": "#8CD17D",
  "Ghost": "#B6992D",
  "Grass": "#499894",
  "Ground": "#86BCB6",
  "Ice": "#86BCB6",
  "Normal": "#E15759",
  "Poison": "#FF9D9A",
  "Psychic": "#79706E",
  "Steel": "#BAB0AC",
  "Water": "#D37295"

}

// load data and make scatter plot after window loads
window.onload = function () {
    svgContainer = d3.select("#chart")
        .append('svg')
        .attr('width', msm.width)
        .attr('height', msm.height);

    // d3.csv is basically fetch but it can be be passed a csv file as a parameter
    d3.csv("pokemon.csv")
    .then((data) => {
      data = data
      allData = data
      makeScatterPlot("all")
    }
    );
}

function filterByGeneration(gen) {
  if (gen == "all") {
    data = allData
  } else {
    data = allData.filter((row) => row["Generation"] == gen)
  }
}

// make scatter plot
function makeScatterPlot(gen) {
  filterByGeneration(gen)


    // assign data as global variable; filter out unplottable values
//    data = csvData.filter((data) => {return data['Sp. Def'] != "NA" && data['Total'] != "NA"})

//    let dropDown = d3.select("#filter").append("select")
//        .attr("name", "Generation");

    // get arrays of fertility rate data and life Expectancy data
    let def_data = data.map((row) => parseFloat(row["Sp. Def"]));
    let total_data = data.map((row) => parseFloat(row["Total"]));

    // find data limits
    let axesLimits = findMinMax(def_data, total_data);

    // draw axes and return scaling + mapping functions
    let mapFunctions = drawAxes(axesLimits, "Sp. Def", "Total", svgContainer, msm);

    var legDropDown = d3.select("body").append("select").attr("class", "leg-selector")

    var legDropDown = d3.select("body").append("select").attr("class", "leg-selector")

    var legOptions = ["All", "True", "False"]
    legDropDown
      .selectAll('myOptions')
      .data(legOptions)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });

    legDropDown.on("change", function () {
      legSelected = d3.select(this).property("value");
      var displayOthers = this.checked ? "inline" : "none";
      var display = this.checked ? "none" : "inline";

      if (legSelected == "All" && genSelected == "All") {
        svgContainer.selectAll("circle")
          .attr("display", display);
      } else if (legSelected != "All" && genSelected == "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return legSelected != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return legSelected == d.Legendary; })
          .attr("display", display);
      } else if (legSelected == "All" && genSelected != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected != d.Generation; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected == d.Generation; })
          .attr("display", display);
      } else if (legSelected != "All" && genSelected != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected != d.Generation || legSelected != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected == d.Generation && legSelected == d.Legendary; })
          .attr("display", display);
      }
    });

    var genDropDown = d3.select("body").append("select").attr("class", "gen-selector")

    var genDefaultOption = genDropDown.append("option")
      .data(data)
      .text("All")
      .attr("value", "All")
      .enter();
    var genOptions = genDropDown.selectAll("option.state")
      .data(d3.map(data, function (d) { return d.Generation }).keys())
      .enter()
      .append("option")
      .text(function (d) { return d; });

    genDropDown.on("change", function () {
      genSelected = d3.select(this).property("value");
      var displayOthers = this.checked ? "inline" : "none";
      var display = this.checked ? "none" : "inline";

      if (legSelected == "All" && genSelected == "All") {
        svgContainer.selectAll("circle")
          .attr("display", display);
      } else if (legSelected != "All" && genSelected == "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return legSelected != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return legSelected == d.Legendary; })
          .attr("display", display);
      } else if (legSelected == "All" && genSelected != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected != d.Generation; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected == d.Generation; })
          .attr("display", display);
      } else if (legSelected != "All" && genSelected != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected != d.Generation || legSelected != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return genSelected == d.Generation && legSelected == d.Legendary; })
          .attr("display", display);
      }
    });







    // plot data as points and add tooltip functionality
    plotData(mapFunctions);

    // draw title and axes labels
    makeLabels(svgContainer, msm, "Pokemon: Special Defense vs Total Stats",'Sp. Def','Total');

}

function createLegend() {
  var size = 20
  svgContainer.selectAll("mydots")
    .data(d3.map(data, function (d) { return d["Type 1"] }).keys())
    .enter()
    .append("rect")
    .attr("x", 100)
    .attr("y", function (d, i) { return 100 + i * (size + 5) })
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) { return colors[d] })
    .attr("transform", "translate(675,130)")

  // Add one dot in the legend for each name.
  svgContainer.selectAll("mylabels")
    .data(d3.map(data, function (d) { return d["Type 1"] }).keys())
    .enter()
    .append("text")
    .attr("x", 100 + size * 1.2)
    .attr("y", function (d, i) { return 100 + i * (size + 5) + (size / 2) })
    .style("fill", function (d) { return colors[d] })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("transform", "translate(675,130)")
}

// make title and axes labels
function makeLabels(svgContainer, msm, title, x, y) {
    svgContainer.append('text')
        .attr('x', (msm.width - 2 * msm.marginAll) / 2 - 90)
        .attr('y', msm.marginAll / 2 + 10)
        .style('font-size', '10pt')
        .text(title);

    svgContainer.append('text')
        .attr('x', (msm.width - 2 * msm.marginAll) / 2 - 30)
        .attr('y', msm.height - 10)
        .style('font-size', '10pt')
        .text(x);

    svgContainer.append('text')
        .attr('transform', 'translate( 15,' + (msm.height / 2 + 30) + ') rotate(-90)')
        .style('font-size', '10pt')
        .text(y);
}

// plot all the data points on the SVG
// and add tooltip functionality
function plotData(map) {
    // get population data as array
//    curData = data.filter((row) => {
//        return row.Generation == 6 && row["Sp. Def"] != "NA" && row["Total"] != "NA"
//    })
//    let pop_data = data.map((row) => +row["population"]);
//    let pop_limits = d3.extent(pop_data);
    // make size scaling function for population
//    let pop_map_func = d3.scaleSqrt()
//        .domain([pop_limits[0], pop_limits[1]])
//        .range([3, 50]);

    // mapping functions
    let xMap = map.x;
    let yMap = map.y;

    // make tooltip
    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // let toolTipChart = div.append("div").attr("id", "tipChart")
//    let toolChart = div.append('svg')
//        .attr('width', small_msm.width)
//        .attr('height', small_msm.height)

    // append data to SVG and plot as points
    svgContainer.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', xMap)
        .attr('cy', yMap)

//        .attr('stroke', "#69b3a2")
        .attr('r', 6)
        .attr('fill', function (d) { return colors[d["Type 1"]] })
//        .attr("class", "circles")
        // add tooltip functionality to points
        .on("mouseover", (d) => {
            div.transition()
                .duration(200)
                .style("opacity", .9);
//            plotPopulation(d.country, toolChart)
            div.html(d.Name + "<br/>" +
                     d['Type 1'] + "<br/>" +
                    //"Population:      " + numberWithCommas(d["population"]) + "<br/>" +
                     d['Type 2'] + "<br/>")
                    // "Country:         " + d.country)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

/** function plotPopulation(country, toolChart) {
    let countryData = data.filter((row) => {return row.country == country})
    let population = countryData.map((row) => parseInt(row["population"]));
    let year = countryData.map((row) => parseInt(row["year"]));

    let axesLimits = findMinMax(year, population);
    let mapFunctions = drawAxes(axesLimits, "year", "population", toolChart, small_msm);
    toolChart.append("path")
        .datum(countryData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
                    .x(function(d) { return mapFunctions.xScale(d.year) })
                    .y(function(d) { return mapFunctions.yScale(d.population) }))
    makeLabels(toolChart, small_msm, "Population Over Time For " + country, "Year", "Population (in Millions)");
}
**/

// draw the axes and ticks
function drawAxes(limits, x, y, svgContainer, msm) {
    // return x value from a row of data
    let xValue = function (d) {
        return +d[x];
    }

    // function to scale x value
    let xScale = d3.scaleLinear()
        .domain([limits.xMin - 0.5, limits.xMax + 0.5]) // give domain buffer room
        .range([0 + msm.marginAll, msm.width - msm.marginAll])

    // xMap returns a scaled x value from a row of data
    let xMap = function (d) {
        return xScale(xValue(d));
    };

    // plot x-axis at bottom of SVG
    let xAxis = d3.axisBottom().scale(xScale);
    svgContainer.append("g")
        .attr('transform', 'translate(0, ' + (msm.height - msm.marginAll) + ')')
        .call(xAxis);

    // return y value from a row of data
    let yValue = function (d) {
        return +d[y]
    }

    // function to scale y
    let yScale = d3.scaleLinear()
        .domain([limits.yMax + 5, limits.yMin - 5]) // give domain buffer
        .range([0 + msm.marginAll, msm.height - msm.marginAll])

    // yMap returns a scaled y value from a row of data
    let yMap = function (d) {
        return yScale(yValue(d));
    };

    // plot y-axis at the left of SVG
    let yAxis = d3.axisLeft().scale(yScale);
    svgContainer.append('g')
        .attr('transform', 'translate(' + msm.marginAll + ', 0)')
        .call(yAxis);

    // return mapping and scaling functions
    return {
        x: xMap,
        y: yMap,
        xScale: xScale,
        yScale: yScale
    };
}

// find min and max for arrays of x and y
function findMinMax(x, y) {

    // get min/max x values
    let xMin = d3.min(x);
    let xMax = d3.max(x);

    // get min/max y values
    let yMin = d3.min(y);
    let yMax = d3.max(y);

    // return formatted min/max data as an object
    return {
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax
    }
}

/**
// format numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
**/
