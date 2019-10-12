var width = 1000,
    height = 350;
var lesisvg = d3.select("#grafico3").append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("background-color", "#272727")
    .style("font-color", "white")
    .append("g")
    .attr("transform", "translate(0,0)")

var tooltip = d3.select("#grafico3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
var showTooltip = function(d) {
    tooltip
        .transition()
        .duration(200)
    tooltip
        .style("opacity", 1)
        .html("" + d.Entidad + " " + d.Tlesioncienmh)
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var moveTooltip = function(d) {
    tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var hideTooltip = function(d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}
var ordinal = d3.scaleOrdinal()
    .domain(["Alto", "Medio", "Bajo", "Nacional", "CDMX"])
    .range(["#ff652f", "#ffe400 ", "#14a76c", "#00FFFF", "#FF0000"]);

var lesisvg = d3.select("svg");

lesisvg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(20,20)")
    .attr("text-anchor", "start")
    .attr("font", "Verdana, Helvetica, Arial, sans - serif ")
    .style("font-size", "15px")
    .attr("font-weight", "bold")
    .style("fill", "white")

var legendOrdinal = d3.legendColor()
    //d3 symbol creates a path-string, for example
    //"M0,-8.059274488676564L9.306048591020996,
    //8.059274488676564 -9.306048591020996,8.059274488676564Z"
    .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
    .shapePadding(1)
    //use cellFilter to hide the "e" cell
    .cellFilter(function(d) { return d.Catles !== "d" })
    .scale(ordinal);

lesisvg.select(".legendOrdinal")
    .call(legendOrdinal)


lesisvg.append("text")
    .attr("x", (width / 2))
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .style("font-size", "18px")
    .attr("font-weight", "bold")
    .style("fill", "white")
    .text("Tasa de personas lesionadas en accidentes viales por cada 1000,000 hab, México 2018");

lesisvg.append("text")
    .attr("x", (width / 2.5))
    .attr("y", 349)
    .attr("textalign", "right")
    .attr("font-family", "sans-serif")
    .style("font-size", "12px")
    .style("fill", "white")
    .text("Fuente:INEGI Accidentes de tránsito terrestre 2018 disponible en https://www.inegi.org.mx/temas/accidentes/");

var radiusScale = d3.scaleSqrt().domain([77, 2000]).range([10, 50])

var forceXSeparar = d3.forceX(function(d) {
    if (d.Catles === "ALTO") {
        return 130
    } else if (d.Catles === "MEDIO") {
        return 500
    } else {
        return 800
    }
}).strength(0.3)

var forceXCombine = d3.forceX(width / 2).strength(0.5)

var forceCollide = d3.forceCollide(function(d) {
    return radiusScale(d.Tlesioncienmh * 3)
})
var simulation = d3.forceSimulation()
    .force("x", forceXCombine)
    .force("y", d3.forceY(height / 1.7).strength(.5))
    .force("collide", forceCollide)

//d3.queue()
//.defer(d3.csv, "tasas.csv")
//.await(ready)

//function ready(error, datapoints) {

d3.csv("/static/scripts/tasas2.csv", function(error, tasas) {
    if (error) return console.warn(error);
    tasas.forEach(function(data) {
        data.Entidad = data.Entidad;
        data.Total = +data.Tot;
        data.Tasaaccidentes = +data.Tasaaccidentes;
        data.Grupo = data.Grupo;
        data.Totaldecesos = +data.Totaldecesos;
        data.Totallesionados = +data.Totallesionados;
        data.Tdecesoscienmh = +data.Tdecesoscienmh;
        data.Tlesioncienmh = +data.Tlesioncienmh;
        data.catdecesos = data.Catdesc;
        data.catles = data.Catles;
    });

    var circles = lesisvg.selectAll("d.Entidad")
        .data(tasas)
        .enter()
        .append("circle")
        .attr("class", "d.Entidad")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("r", function(d) {
            return radiusScale(d.Tlesioncienmh * 3)
        })
        .attr("fill", function(d) {
            if (d.Catles === "ALTO") {
                return "#ff652f"
            } else if (d.Entidad === "Estados Unidos Mexicanos") {
                return "#00FFFF"
            } else if (d.Entidad === "Ciudad de México") {
                return "#FF0000"
            } else if (d.Catles === "MEDIO") {
                return "#ffe400"
            } else {
                return "#14a76c"
            }

        })

    .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)

    .on("click", function(d) {
        console.log(d)
    })

    d3.select("#Grupo2").on('click', function() {
        simulation
            .force("x", forceXSeparar)
            .alphaTarget(0.25)
            .restart()
    })

    d3.select("#Combinar2").on('click', function() {
        simulation
            .force("x", forceXCombine)
            .alphaTarget(0.25)
            .restart()
    })

    simulation.nodes(tasas)
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
})