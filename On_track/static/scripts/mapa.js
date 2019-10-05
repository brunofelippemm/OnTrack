function map() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50 },
        height = 400 - margin.top - margin.bottom,
        width = 800 - margin.left - margin.right;
    var svg = d3.select("#map")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.queue()
        .defer(d3.json, "estados_1.topojson")
        .defer(d3.csv, "tasas.csv")
        .await(ready)

    var projection = d3.geoMercator()
        .translate([width * 2.5, height * 1.4])
        .scale(800)

    var path = d3.geoPath()
        .projection(projection)

    function ready(error, data, tasas) {
        console.log(data)

        var states = topojson.feature(data, data.objects.estados_1).features
        console.log(states)

        svg.selectAll(".state")
            .data(states)
            .enter().append("path")
            .attr("class", "state")
            .attr("d", path)
            .on('mouseover', function(d) {
                d3.select(this).classed("selected", true)
            })
            .on('mouseout', function(d) {
                d3.select(this).classed("selected", false)
            })
        console.log(tasas)
        svg.selectAll(".city-circle")
            .data(tasas)
            .enter().append("circle")
            .attr("r", 2)
            .attr("fill", "red")
            .attr("cx", function(d) {
                var coords = projection([d.long, d.lat])
                return coords[0];
            })
            .attr("cy", function(d) {
                var coords = projection([d.long, d.lat])
                return coords[1];
            })
        svg.selectAll(".city-label")
            .data(tasas)
            .enter().append("text")
            .attr("class", "city-label")
            .attr("x", function(d) {
                var coords = projection([d.long, d.lat])
                return coords[0];
            })
            .attr("y", function(d) {
                var coords = projection([d.long, d.lat])
                return coords[1];
            })
            .text(function(d) {
                return d.Tot
            })
    }

}

map();