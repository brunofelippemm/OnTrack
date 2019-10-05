function bubble() {
    var width = 1000,
        height = 300;
    var svg = d3.select("#grafico").append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    var radiusScale = d3.scaleSqrt().domain([77, 2000]).range([10, 50])

    var forceXSeparar = d3.forceX(function(d) {
        if (d.Grupo === "ALTO") {
            return 100
        } else if (d.Grupo === "MEDIO") {
            return 500
        } else {
            return 800
        }
    }).strength(0.5)

    var forceXCombine = d3.forceX(width / 2).strength(0.05)

    var forceCollide = d3.forceCollide(function(d) {
        return radiusScale(d.Tasaaccidentes / 3)
    })
    var simulation = d3.forceSimulation()
        .force("x", forceXCombine)
        .force("y", d3.forceY(height / 2).strength(.7))
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.csv, "tasas.csv")
        .await(ready)

    function ready(error, datapoints) {

        var circles = svg.selectAll(".Entidad")
            .data(datapoints)
            .enter()
            .append("circle")
            .attr("class", "entidad")
            .attr("r", function(d) {
                return radiusScale(d.Tasaaccidentes / 5);
            })
            .attr("fill", "blue")
            .on("click", function(d) {
                console.log(d)
            })
        d3.select("#Grupo").on('click', function() {
            simulation
                .force("x", forceXSeparar)
                .alphaTarget(0.25)
                .restart()
        })

        d3.select("#Combinar").on('click', function() {
            simulation
                .force("x", forceXCombine)
                .alphaTarget(0.25)
                .restart()
        })

        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function(d) {
                    return d.x
                })
                .attr("cy", function(d) {
                    return d.y
                })
        }
    }
}
bubble();