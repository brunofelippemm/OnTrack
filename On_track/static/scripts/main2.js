var tilesPerRow = 2;
var tileSize = 25;
var barPadding = 20;
var maxValue = 30;
var numVisibleDel = 16;

var barWidth = (tilesPerRow * tileSize) + barPadding;

var data, filteredData;
let colors = ["#740F97 ", "#8A7999", "#EBE416", "#ffd275 ", "#EC6634 "];

var selectedYear = 2019,
    selectedMode = "top10";

function initializeData() {
    data = data.map(function(d) {
        return {
            name: d.delegacion,
            year: +d.ano,
            lesionados: +d.lesionados,
            decesos: +d.decesos,

        }
    });
}

function updateFilteredData() {
    filteredData = data.filter(function(d) {
        return d.year === selectedYear;
    });
    filteredData = _.sortBy(filteredData, function(d) {
        return selectedMode === "top10" ? -d.decesos : d.decesos;
    });
    filteredData = filteredData.slice(0, numVisibleDel);
}

function getTiles(num) {
    var tiles = [];

    for (var i = 0; i < num; i++) {
        var rowNumber = Math.floor(i / tilesPerRow);
        tiles.push({
            x: (i % tilesPerRow) * tileSize,
            y: -(rowNumber + 1) * tileSize
        });
    }

    return tiles
}

function updateBar(d, i) {
    var tiles = getTiles(d.decesos);

    var u = d3.select(this)
        .attr("transform", "translate(" + i * barWidth + ", 300)")
        .selectAll("rect")
        .data(tiles);

    u.enter()
        .append("rect")
        .style("opacity", 0)
        .style("stroke", "white")
        .style("stroke-width", "0.5")
        .style("shape-rendering", "crispEdges")
        .merge(u)
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("width", tileSize)
        .attr("height", tileSize)
        .transition()
        .delay(function(d, i) {
            return i * 20;
        })
        .style("opacity", 1);

    u.exit()
        .transition()
        .delay(function(d, i) {
            return (100 - i) * 20;
        })
        .style("opacity", 0)
        .on("end", function() {
            d3.select(this).remove();
        });
}

function updateLabel(d) {
    var el = d3.select(this)
        .select("text");

    if (el.empty()) {
        el = d3.select(this)
            .append("text")
            .attr("y", -4)
            .attr("transform", "rotate(-90)")
            .style("font-size", "14px")
            .style("fill", "#272727");
    }

    el.text(d.name + "      " + d.decesos);
}

function updateBars() {
    var u = d3.select("g.bars")
        .selectAll("g")
        .data(filteredData);

    u.enter()
        .append("g")
        .merge(u)
        .style("fill", function(d, i) {
            return colors[i % colors.length];
        })
        .each(updateBar)
        .each(updateLabel);

    u.exit().remove();
}

//function updateAxis() {
//var chartWidth = numVisibleDel * barWidth;
//var chartHeight = (maxValue / tilesPerRow) * tileSize;

//var yScale = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]);
//var yAxis = d3.axisRight().scale(yScale).tickSize(chartWidth);

//d3.select(".y.axis")
//.call(yAxis);
//}

function initialize() {
    initializeData();

    d3.select("select.mode")
        .on("change", function() {
            selectedMode = this.value;
            update();
        })

    d3.select("select.year")
        .on("change", function() {
            selectedYear = +this.value;
            update();
        });
}

function update() {
    updateFilteredData();
    updateBars();
    //   updateAxis();
}
d3.csv("data/vflesionados.csv", function(error, csv) {
    data = csv
    if (error) return console.warn(error)
    console.log(data);

    initialize();
    update();

});