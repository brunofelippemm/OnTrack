var myMap = L.map("map", {
    center: [19.369885, -99.127150],
    zoom: 10
  });
  
  
  // Add a tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  }).addTo(myMap);
  
  function refine(ref) {
  
    if (ref === "codigocierre") {
      function codigocierre(letter) {
        if (letter === "a") {
          return "&refine.codigo_cierre=(A)+La+unidad+de+atenci%C3%B3n+a+emergencias+fue+despachada%2C+lleg%C3%B3+al+lugar+de+los+hechos+y+confirm%C3%B3+la+emergencia+reportada"
        } else if (letter === "d") {
          return "&refine.codigo_cierre=(D)+El+incidente+reportado+se+registr%C3%B3+en+dos+o+m%C3%A1s+ocasiones+procediendo+a+mantener+un+%C3%BAnico+reporte+(afirmativo%2C+informativo%2C+negativo+o+falso)+como+el+identificador+para+el+incidente"
        } else if (letter === "n") {
          return "&refine.codigo_cierre=(N)+La+unidad+de+atenci%C3%B3n+a+emergencias+fue+despachada%2C+lleg%C3%B3+al+lugar+de+los+hechos%2C+pero+en+el+sitio+del+evento+nadie+solicit%C3%B3+el+apoyo+de+la+unidad"
        } else if (letter === "f") {
          return "&refine.codigo_cierre=(F)+El+operador%2Fa+o+despachador%2Fa+identifican%2C+antes+de+dar+respuesta+a+la+emergencia%2C+que+ésta+es+falsa.+O+al+ser+despachada+una+unidad+de+atención+a+emergencias+en+el+lugar+de+los+hechos+se+percatan+que+el+incidente+no+corresponde+al+reportado+inicialmente"
        } else if (letter === "i") {
          return "&refine.codigo_cierre=(I)+El+incidente+reportado+es+afirmativo+y+se+a%C3%B1ade+informaci%C3%B3n+adicional+al+evento"
        } else {
          return "No letra"
        }
      }
      return codigocierre
    } else if (ref === "ano") {
      function ano(numero) {
        return `&refine.ano=${numero}`
      };
      return ano;
    } else if (ref === "mescierre") {
      function mescierre(mes) {
        return `&refine.mesdecierre=${mes}`
      };
      return mescierre;
    } else if (ref === "delegacion") {
      function delegacion(d) {
        return `&refine.delegacioninicio=${d}`
      };
      return delegacion;
    } else if (ref === "incidente") {
      function incidente(c4) {
        return `&refine.incidente_c4=${c4}`
      };
      return incidente;
    } else if (ref === "tipo") {
      function tipo(alarma) {
        return `&refine.clas_con_f_alarma=${alarma}`
      };
      return tipo;
    } else if (ref === "entrada") {
      function entrada(tipo) {
        return `&refine.tipo_entrada=${tipo}`
      };
      return entrada;
  
    };
  }
  
  function furl(frows, frefine) {
    var url = "https://datos.cdmx.gob.mx/api/records/1.0/search/"
    var dataset = "?dataset=incidentes-viales-c5"
    var facets = "&facet=codigo_cierre&facet=ano&facet=mesdecierre&facet=delegacion_inicio&facet=incidente_c4&facet=clas_con_f_alarma&facet=tipo_entrada"
    var c5 = url + dataset + `&rows=${frows}` + facets + `${frefine}`
    return c5
  }
  
  
  
  
  //accidente-choque+sin+lesionados
  
  
  var queryUrl = furl(1000, refine("ano")(2019)) + refine("incidente")("accidente-choque+sin+lesionados");
  
  
  var alcaldiaUrl = 'https://datos.cdmx.gob.mx/api/records/1.0/search/?dataset=coloniascdmx&facet=nombre&facet=alcaldia'
  // var queryUrl = furl(100, refine("codigocierre")("a")) + refine("ano")(2016) + refine("incidente")["automovilistico"]
  
  //FUNCION DELEGACION ORIGINAL
  
  // function delegacion(nombre) {
  
  //   //   console.log(nombre);
  //   //   d3.json(queryUrl, function (data) {
  
  //   //     for (var i = 0; i < data.records.length; i++) {
  //   //       var records = data.records[i];
  //   //       var fields = records.fields;
  //   //       var geopoint = records.fields.geopoint;
  //   //       if (fields.delegacion_inicio === nombre) {
  //   //         L.marker(geopoint, { color: "red" })
  //   //           .bindPopup("<h1>" + `${nombre}` + "</h1> <hd>" + `<h2>${fields.fecha_creacion}</h2>` + "<hd>" + `${fields.clas_con_f_alarma}` + "<hd>" + `<h3>${fields.tipo_entrada}</h3>` + "<hd>")
  //   //           .addTo(myMap)
  //   //       }
  //   //     }
  
  //   //   });
  // }
  
  
  //FUNCION DE CLUSTERS
  
  // Grab the data with d3
  // d3.json(queryUrl, function (response) {
  
  //   // Create a new marker cluster group
  //   var markers = L.markerClusterGroup();
  
  //   // Loop through data
  //   for (var i = 0; i < response.records.length; i++) {
  
  //     // Set the data location property to a variable
  
  
  //     var records = response.records[i];
  //     var fields = records.fields;
  //     var geopoint = records.fields.geopoint;
  
  //     // Check for location property
  //     if (geopoint) {
  
  //       // Add a new marker to the cluster group and bind a pop-up
  //       markers.addLayer(L.marker([fields.geopoint[0], fields.geopoint[1]])
  //         .bindPopup(`<h1>${fields.hora_creacion}<h1>` + "<hd>" + `${fields.incidente_c4}`));
  //     }
  
  //   }
  
  //   // Add our marker cluster layer to the map
  //   myMap.addLayer(markers);
  
  // });
  
  function delegacion(nombre) {
    // Grab the data with d3
    d3.json(queryUrl, function (response) {
      delegacionList = []
      // Create a new marker cluster group
      var markers = L.markerClusterGroup({ 
          spiderfyOnMaxZoom: true, 
          showCoverageOnHover: false, 
          zoomToBoundsOnClick: true, 
          removeOutsideVisibleBounds:true, 
          spiderLegPolylineOptions: { 
              weight: 3, 
              color: 'white', 
              opacity: 1 } });
      // Loop through data
      for (var i = 0; i < response.records.length; i++) {
  
        // Set the data location property to a variable
  
  
        var records = response.records[i];
        var fields = records.fields;
        var geopoint = records.fields.geopoint;
  
        // Check for location property
  
        if (fields.delegacion_inicio === nombre) {
          delegacionList.push(fields.geopoint)
          // Add a new marker to the cluster group and bind a pop-up
          markers.addLayer(L.marker([fields.geopoint[0], fields.geopoint[1]])
            .bindPopup(`${fields.hora_creacion}<br>` + "<hd>" + `${fields.incidente_c4}`));
        }
  
      }
  
      // Add our marker cluster layer to the map
      myMap.addLayer(markers);
  
    });
  }
  
  d3.json(alcaldiaUrl, function (data) {
    console.log(data)
    for (var i = 0; i < data.length; i++) {
      console.log(data)
    }
  })
  
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
  };
  
  var width = 260;
  var height = 600;
  
  // console.log(url);
  
  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var data_alcaldias = alcaldias;
  
  // delegacion(document.getElementById('delegacion').value = 'CUAJIMALPA')
  // delegacion(document.getElementById('delegacion').value = 'ALVARO OBREGON')
  // delegacion(document.getElementById('delegacion').value = 'AZCAPOTZALCO')
  // delegacion(document.getElementById('delegacion').value = 'IZTAPALAPA')
  // delegacion(document.getElementById('delegacion').value = 'CUAUHTEMOC')
  // delegacion(document.getElementById('delegacion').value = 'MIGUEL HIDALGO')
  // delegacion(document.getElementById('delegacion').value = 'GUSTAVO A. MADERO')
  // delegacion(document.getElementById('delegacion').value = 'COYOACAN')
  // delegacion(document.getElementById('delegacion').value = 'VENUSTIANO CARRANZA')
  // delegacion(document.getElementById('delegacion').value = 'TLALPAN')
  // delegacion(document.getElementById('delegacion').value = 'MILPA ALTA')
  // delegacion(document.getElementById('delegacion').value = 'MAGDALENA CONTRERAS')
  // delegacion(document.getElementById('delegacion').value = 'TLAHUAC')
  // delegacion(document.getElementById('delegacion').value = 'XOCHIMILCO')
  // delegacion(document.getElementById('delegacion').value = 'BENITO JUAREZ')
  // delegacion(document.getElementById('delegacion').value = 'IZTACALCO')
  
  // d3.json(data_aclaldias, function (z) {
  //   if (z === )
  // })
  
  function choose(a) {
    if (a === 'CUAJIMALPA') {
      return delegacion(document.getElementById('delegacion').value = 'CUAJIMALPA')
    } else if (a === 'ALVARO OBREGON') {
      return delegacion(document.getElementById('delegacion').value = 'ALVARO OBREGON')
    } else if (a === 'IZTAPALAPA') {
      return delegacion(document.getElementById('delegacion').value = 'IZTAPALAPA')
    } else if (a === 'CUAUHTEMOC') {
      return delegacion(document.getElementById('delegacion').value = 'CUAUHTEMOC')
    } else if (a === 'MIGUEL HIDALO') {
      return delegacion(document.getElementById('delegacion').value = 'MIGUEL HIDALGO')
    } else if (a === 'COYOACAN') {
      return delegacion(document.getElementById('delegacion').value = 'COYOACAN')
    } else if (a === 'AZCAPOTZALCO') {
      return delegacion(document.getElementById('delegacion').value = 'AZCAPOTZALCO')
    } else if (a === 'VENUSTIANO CARRANZA') {
      return delegacion(document.getElementById('delegacion').value = 'VENUSTIANO CARRANZA')
    } else if (a === 'TLALPAN') {
      return delegacion(document.getElementById('delegacion').value = 'TLALPAN')
    } else if (a === 'MILPA ALTA') {
      return delegacion(document.getElementById('delegacion').value = 'MILPA ALTA')
    } else if (a === 'MAGDALENA CONTRERAS') {
      return delegacion(document.getElementById('delegacion').value = 'MAGDALENA CONTRERAS')
    } else if (a === 'TLAHUAC') {
      return delegacion(document.getElementById('delegacion').value = 'TLAHUAC')
    } else if (a === 'XOCHIMILCO') {
      return delegacion(document.getElementById('delegacion').value = 'XOCHIMILCO')
    } else if (a === 'BENITO JUAREZ') {
      return delegacion(document.getElementById('delegacion').value = 'BENITO JUAREZ')
    } else if (a === 'GUSTAVO A. MADERO') {
      return delegacion(document.getElementById('delegacion').value = 'GUSTAVO A. MADERO')
    } else if (a === 'IZTACALCO') {
      return delegacion(document.getElementById('delegacion').value = 'IZTACALCO')
    } else if (a === 'MIGUEL HIDALGO') {
      return delegacion(document.getElementById('delegacion').value = 'MIGUEL HIDALGO')
    } else {
      return 'no'
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
            if (event.target.feature.properties.nomgeo == 'Tlalpan') {
              myMap.fitBounds(event.target.getBounds(choose('TLALPAN')));
            } else if (event.target.feature.properties.nomgeo == 'Coyoacán') {
              myMap.fitBounds(event.target.getBounds(choose('COYOACAN')));
            } else if (event.target.feature.properties.nomgeo == 'Venustiano Carranza') {
              myMap.fitBounds(event.target.getBounds(choose('VENUSTIANO CARRANZA')));
            } else if (event.target.feature.properties.nomgeo == 'Azcapotzalco') {
              myMap.fitBounds(event.target.getBounds(choose('AZCAPOTZALCO')));
            } else if (event.target.feature.properties.nomgeo == 'Iztapalapa') {
              myMap.fitBounds(event.target.getBounds(choose('IZTAPALAPA')));
            } else if (event.target.feature.properties.nomgeo == 'Iztacalco') {
              myMap.fitBounds(event.target.getBounds(choose('IZTACALCO')));
            } else if (event.target.feature.properties.nomgeo == 'Miguel Hidalgo') {
              myMap.fitBounds(event.target.getBounds(choose('MIGUEL HIDALGO')));
            } else if (event.target.feature.properties.nomgeo == 'La Magdalena Contreras') {
              myMap.fitBounds(event.target.getBounds(choose('MAGDALENA CONTRERAS')));
            } else if (event.target.feature.properties.nomgeo == 'Milpa Alta') {
              myMap.fitBounds(event.target.getBounds(choose('MILPA ALTA')));
            } else if (event.target.feature.properties.nomgeo == 'Tláhuac') {
              myMap.fitBounds(event.target.getBounds(choose('TLAHUAC')));
            } else if (event.target.feature.properties.nomgeo == 'Benito Juárez') {
              myMap.fitBounds(event.target.getBounds(choose('BENITO JUAREZ')));
            } else if (event.target.feature.properties.nomgeo == 'Cuajimalpa de Morelos') {
              myMap.fitBounds(event.target.getBounds(choose('CUAJIMALPA')));
            } else if (event.target.feature.properties.nomgeo == 'Gustavo A. Madero') {
              myMap.fitBounds(event.target.getBounds(choose('GUSTAVO A. MADERO')));
            } else if (event.target.feature.properties.nomgeo == 'Cuauhtémoc') {
              myMap.fitBounds(event.target.getBounds(choose('CUAUHTEMOC')));
            } else if (event.target.feature.properties.nomgeo == 'Álvaro Obregón') {
              myMap.fitBounds(event.target.getBounds(choose('ALVARO OBREGON')));
            } else if (event.target.feature.properties.nomgeo == 'Xochimilco') {
              myMap.fitBounds(event.target.getBounds(choose('XOCHIMILCO')));
            }
          }
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<h5>" + feature.properties.nomgeo + "</h5> <hr> <h6>" + feature.properties.cvegeo + "</h6>");
  
      }
    }).addTo(myMap);
  
  });