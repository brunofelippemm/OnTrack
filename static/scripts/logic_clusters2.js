// Creating map object
var myMap = L.map("map", {
    center: [19.432608, -99.133209],
    zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
}).addTo(myMap);

// Assemble URL for "alcaldias"
// var url = "https://datos.cdmx.gob.mx/api/records/1.0/search/?dataset=alcaldias&facet=nomgeo&facet=cve_mun";
var width = 960;
var height = 600;

// console.log(url);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var data_alcaldias = alcaldias;
// var data_colonias = colonias;
// console.log(data_alcaldias);
// console.log(data_colonias);

function chooseColor(nomgeo) {
    switch (nomgeo) {
        case "Tlalpan":
            return "yellow";
        case "Venustiano Carranza":
            return "red";
        case "Azcapotzalco":
            return "orange";
        case "Iztapalapa":
            return "blue";
        case "Iztacalco":
            return "purple";
        case "Miguel Hidalgo":
            return "green";
        case "La Magdalena Contreras":
            return "pink";
        case "Coyoacán":
            return "purple";
        case "Milpa Alta":
            return "brown";
        case "Tláhuac":
            return "green";
        case "Benito Juárez":
            return "blue";
        case "Cuajimalpa de Morelos":
            return "gray";
        case "Gustavo A. Madero":
            return "yellow";
        case "Cuauhtémoc":
            return "orange";
        case "Álvaro Obregón":
            return "red";
        case "Xochimilco":
            return "blue";
        default:
            return "black";
    }
}

d3.json(data_alcaldias, function (error, json) {
    if (error) console.error(error);
    console.log(data_alcaldias);

    L.geoJSON(data_alcaldias, {
        style: function (feature) {
            return {
                color: "white",
                // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
                fillColor: chooseColor(feature.properties.nomgeo),
                fillOpacity: 0.5,
                weight: 1.5
            };
        },
        // Called on each feature
        onEachFeature: function (feature, layer) {
            // Set mouse events to change map styling
            layer.on({
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
                click: function (event) {
                    map.fitBounds(event.target.getBounds());
                }
            });
            // Giving each feature a pop-up with information pertinent to it
            layer.bindPopup("<h1>" + feature.properties.nomgeo + "</h1> <hr> <h2>" + feature.properties.cvegeo + "</h2>");

        }
    }).addTo(myMap);
});


// d3.json(data_colonias, function (error, json) {
//   if (error) console.error(error);
//   console.log(data_colonias);

//   var myStyle2 = {
//     "color": "#ff7900",
//     "weight": 4,
//     "opacity": 0.65
//   };

//   L.geoJSON(data_colonias, {
//     style: myStyle2
//   }).addTo(myMap);
// });

// // Grab the data with d3 - CLUSTERS
// d3.json(url, function(response) {

//   // Create a new marker cluster group
//   var markers = L.markerClusterGroup();

//   // Loop through data
//   for (var i = 0; i < response.length; i++) {

//     // Set the data location property to a variable
//     var location = response[i].location;

//     // Check for location property
//     if (location) {

//       // Add a new marker to the cluster group and bind a pop-up
//       markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
//         .bindPopup(response[i].descriptor));
//     }

//   }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);

// });