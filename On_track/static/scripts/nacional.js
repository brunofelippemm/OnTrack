var width = 1500,
    height = 350;
var svg = d3.select("#chart1").append("svg")
    .attr("align", "center")
    .attr("height", height)
    .attr("width", width)
    .style("background-color", "#272727")
    .style("font-color", "white")
    .append("g")
    .attr("transform", "translate(0,0)")

var tooltip = d3.select("#chart1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
var showTooltip = function (d) {
    tooltip
        .transition()
        .duration(200)
    tooltip
        .style("opacity", 1)
        .html("" + d.Entidad + " " + d.Tasaaccidentes)
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var moveTooltip = function (d) {
    tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var hideTooltip = function (d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}
//-----------------NEW CODE FROM HERE TO LINE 71------------------------------
var color = d3.scaleOrdinal()
    .domain(["Alto", "Medio", "Bajo", "Nacional", "CDMX"])
    .range(["#ff652f", "#ffe400 ", "#14a76c", "#00FFFF", "#FF0000"]);


var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
        var height = 20;
        var x = 30;
        var y = 10 + i * height;
        return 'translate(' + x + ',' + y + ')';
    });
legend.append('circle')
    .attr('r', 5)
    .style('fill', color)
    .attr('x', 15)
    .attr('y', 11)
    .style('stroke', color);

legend.append('text')
    .attr('x', 15)
    .attr('y', 11)
    .style("fill", "white")
    .style("font-size", "8")
    .text(function (d) { return d; });

//-----------------NEW CODE ENDS HERE------------------------------
//var ordinal = d3.scaleOrdinal()
//.domain(["Alto", "Medio", "Bajo", "Nacional", "CDMX"])
//.range(["#ff652f", "#ffe400 ", "#14a76c", "#00FFFF", "#FF0000"]);


//var svg = d3.select("svg");

//svg.append("g")
//.attr("class", "legendOrdinal")
//.attr("transform", "translate(20,20)")
//.attr("text-anchor", "start")
//.attr("font", "Verdana, Helvetica, Arial, sans - serif ")
//.style("font-size", "15px")
//.attr("font-weight", "bold")
//.style("fill", "white")
//var legendOrdinal = d3.legendColor()
//d3 symbol creates a path-string, for example
//"M0,-8.059274488676564L9.306048591020996,
//8.059274488676564 -9.306048591020996,8.059274488676564Z"
//.shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
//.shapePadding(1)
//use cellFilter to hide the "e" cell
//.cellFilter(function(d) { return d.Grupo !== "d" })
//.scale(ordinal);

//svg.select(".legendOrdinal")
//    .call(legendOrdinal)

// update the value of y to set the title in line with circles general legend

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .style("font-size", "18px")
    .attr("font-weight", "bold")
    .style("fill", "white")
    .text("Tasa de accidentes viales/decesos/lesionados por cada 1000,000 hab, México 2018");
// update the value of y to avoid cut the text
svg.append("text")
    .attr("x", (width / 2.5))
    .attr("y", 348)
    .attr("textalign", "right")
    .attr("font-family", "sans-serif")
    .style("font-size", "12px")
    .style("fill", "white")
    .text("Fuente:INEGI Accidentes de tránsito terrestre 2018 disponible en https://www.inegi.org.mx/temas/accidentes/");

var radiusScale = d3.scaleSqrt().domain([77, 2000]).range([10, 50])

var forceXSeparar = d3.forceX(function (d) {
    if (d.Grupo === "ALTO") {
        return 130
    } else if (d.Grupo === "MEDIO") {
        return 500
    } else {
        return 800
    }
}).strength(0.3)

var forceXCombine = d3.forceX(width / 2).strength(0.5)

var forceCollide = d3.forceCollide(function (d) {
    return radiusScale(d.Tasaaccidentes * 1.1)
})
var simulation = d3.forceSimulation()
    .force("x", forceXCombine)
    .force("y", d3.forceY(height / 1.7).strength(.5))
    .force("collide", forceCollide)

//d3.queue()
//.defer(d3.csv, "tasas.csv")
//.await(ready)

//function ready(error, datapoints) {

d3.csv("static/scripts/nacional.csv", function (error, tasas) {
    if (error) return console.warn(error);
    tasas.forEach(function (data) {
        data.Entidad = data.Entidad;
        data.Total = +data.Tot;
        data.Tasaaccidentes = +data.Tasaaccidentes;
        data.Grupo = data.Grupo;
        data.Totaldecesos = +data.Totaldecesos;
        data.Totallesionados = +data.Totallesionados;
        data.Tdecesoscienmh = +data.Tdecesoscienmh;
        data.Tlesioncienmh = +data.Tlesioncienmh;
    });

    var circles = svg.selectAll("d.Entidad")
        .data(tasas)
        .enter()
        .append("circle")
        .attr("class", "d.Entidad")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("r", function (d) {
            return radiusScale(d.Tasaaccidentes / 1.1);
        })
        .attr("fill", function (d) {
            if (d.Grupo === "ALTO") {
                return "#ff652f"
            } else if (d.Grupo === "MEDIO") {
                return "#ffe400"
            } else {
                return "#14a76c"
            }

        })
        .attr("fill", function (d) {
            if (d.Grupo === "ALTO") {
                return "#ff652f"
            } else if (d.Entidad === "Estados Unidos Mexicanos") {
                return "#00FFFF"
            } else if (d.Entidad === "Ciudad de México") {
                return "#FF0000"
            } else if (d.Grupo === "MEDIO") {
                return "#ffe400"
            } else {
                return "#14a76c"
            }

        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)

        .on("click", function (d) {
            console.log(d)
        })

    d3.select("#Grupo").on('click', function () {
        simulation
            .force("x", forceXSeparar)
            .alphaTarget(0.25)
            .restart()
    })

    d3.select("#Combinar").on('click', function () {
        simulation
            .force("x", forceXCombine)
            .alphaTarget(0.25)
            .restart()
    })
    //d3.select("#Decesos").on('click', function() {
    // UpdateData()
    //})

    simulation.nodes(tasas)
        .on('tick', ticked)

    function ticked() {
        circles
            .attr("cx", function (d) {
                return d.x
            })
            .attr("cy", function (d) {
                return d.y
            });
    }

    // function updateData() {

    // Get the data again
    // d3.csv("nacional.csv", function(error, tasas) {
    //if (error) return console.warn(error);
    //tasas.forEach(function(data) {
    //    data.Entidad = data.Entidad;
    //  data.Total = +data.Tot;
    //  data.Tasaaccidentes = +data.Tasaaccidentes;
    //data.Grupo = data.Grupo;
    // data.Totaldecesos = +data.Totaldecesos;
    // data.Totallesionados = +data.Totallesionados;
    // data.Tdecesoscienmh = +data.Tdecesoscienmh;
    // data.Tlesioncienmh = +data.Tlesioncienmh;
    //});
    // Scale the range of the data again 
    //x.domain(d3.extent(data, function(d) { return d.date; }));
    //y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Select the section we want to apply our changes to
    //var svg = d3.select("body").transition();
    // Make the changes
    d3.select("#Nacional").on("click", function () {
        circles
            .transition()
            .attr("r", function (d) {
                return radiusScale(d.Tasaaccidentes / 1.1);
            })


    });

    d3.select("#Decesos").on("click", function () {
        circles
            .transition()
            .attr("r", function (d) {
                return radiusScale(d.Tdecesoscienmh * 50);
            })

    })


    d3.select("#Lesionados").on("click", function () {
        circles
            .transition()
            .attr("r", function (d) {
                return radiusScale(d.Tlesioncienmh * 2);
            })
    })


})



//svg.select(".x.axis") // change the x axis
//.duration(750)
//.call(xAxis);
//svg.select(".y.axis") // change the y axis
//.duration(750)
//.call(yAxis);
//d3.select("#Decesos").on('click', function() {
//UpdateData()d3.select("#chart")