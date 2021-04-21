define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/layers/FeatureLayer", "dojo/_base/lang", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/QueryTask", "esri/tasks/query", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/symbols/SimpleLineSymbol", "esri/tasks/RelationshipQuery", "dojo/on", "esri/plugins/FeatureLayerStatistics", "esri/layers/ArcGISDynamicMapServiceLayer"], function (declare, BaseWidget, FeatureLayer, lang, Extent, SpatialReference, QueryTask, query, graphic, SimpleFillSymbol, Color, SimpleLineSymbol, RelationshipQuery, on, FeatureLayerStatistics, ArcGISDynamicMapServiceLayer) {

      var capa_clientes;
      var capa_cableado;
      var capa_centrales;
      var capa_cableado;
      var capaActual;
      var geometria_cableado;
      var geometria_municipios;
      var geometria_municipio_seleccionado;
      var nombreMunicipio_seleccionado;
      var municipiosFiltrados;
      var municipio_individual;
      var capa_conductos;

      //To create a widget, you need to derive from BaseWidget.
      return declare([BaseWidget], {

            // Custom widget code goes here

            baseClass: 'filtro-d-c',
            // this property is set by the framework when widget is loaded.
            // name: 'Filtro_DC',
            // add additional properties here

            //methods to communication with app container:
            postCreate: function postCreate() {
                  this.inherited("Argumentos", arguments);
            },

            startup: function startup() {
                  this.inherited(arguments);
            },

            onOpen: function onOpen() {

                  console.log(this.map.extent);

                  var consultaMunicipios = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/FeatureServer/0");

                  console.log("Estoy en la linea 56");

                  var queryMunicipios = new query();
                  queryMunicipios.returnGeometry = true;
                  queryMunicipios.outFields = ["*"];
                  queryMunicipios.orderByFields = ["municpio_1"];
                  queryMunicipios.where = "1=1";

                  console.log("Estoy en la linea 64", queryMunicipios);

                  consultaMunicipios.execute(queryMunicipios, lang.hitch(this, function (evt) {

                        console.log("Estoy en la linea 68", evt);

                        var opciones = document.createElement("option");
                        opciones.value = -1;
                        opciones.text = "Seleccione un municipio";
                        this.buscador_municipios.add(opciones);

                        for (i = 0; i < evt.features.length; i++) {

                              opciones = document.createElement("option");
                              opciones.value = evt.features[i].attributes.objectid;
                              opciones.text = evt.features[i].attributes.municpio_1;
                              this.buscador_municipios.add(opciones);
                        }
                  }));
            },

            zoomMunicipios: function zoomMunicipios() {

                  if (this.buscador_municipios.value == -1) return;

                  var consultaZoomMunicipio = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/FeatureServer/0");

                  var queryZoomMunicipio = new query();
                  queryZoomMunicipio.returnGeometry = true;
                  queryZoomMunicipio.outFields = ["municpio_1", "objectid"];
                  queryZoomMunicipio.where = "objectid = " + this.buscador_municipios.value;
                  queryZoomMunicipio.outSpatialReference = new SpatialReference(102100);

                  consultaZoomMunicipio.execute(queryZoomMunicipio, lang.hitch(this, function (evt) {

                        console.log("evt", evt);

                        if (evt.features.length > 0) {

                              var geometria = evt.features[0].geometry;
                              this.map.graphics.clear();
                              this.map.graphics.add(new graphic(geometria, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASH, new Color([234, 152, 223]), 2), new Color([235, 141, 106, 0.25]))));

                              /*this.map.setExtent(geometria.getExtent(), true)*/

                              console.log("La geometria es", geometria);
                        }
                  }));
            },
            añadir_conductos: function aAdir_conductos() {

                  capa_conductos = new ArcGISDynamicMapServiceLayer("https://localhost:6443/arcgis/rest/services/Proyecto/ServicioConductos/MapServer");

                  capa_conductos.setOpacity(0.5);

                  this.map.addLayer(capa_conductos);

                  console.log("Mapita:", this.map);
            },
            añadir_clientes: function aAdir_clientes() {

                  console.log("estado: " + this.Clientes.ckecked);

                  if (this.Clientes.checked == true) {

                        capa_clientes = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Clientes/MapServer/0");

                        this.map.addLayer(capa_clientes);

                        var extension = new Extent(-424988.21030558174, 4914314.611985733, -398120.5948633785, 4939577.049833949, new SpatialReference({ wkid: 102100 }));

                        this.map.setExtent(extension);
                  } else if (this.Clientes.checked == false) {

                        this.map.removeLayer(capa_clientes);

                        var extension = new Extent(-560683.0447687416, 4812156.523682616, -345742.1212309296, 5014256.026468524, new SpatialReference({ wkid: 102100 }));
                  }
            },
            añadir_cableado: function aAdir_cableado() {

                  if (this.Cableado.checked == true) {

                        capa_cableado = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/ServicioCableado/FeatureServer/4", {
                              mode: FeatureLayer.MODE_ONDEMAND,
                              outFields: ["*"]
                        });

                        this.map.addLayer(capa_cableado);

                        var extensionCab = new Extent(-475455.75823086995, 4880185.478856351, -367985.29646187095, 4981235.230249394, new SpatialReference({ wkid: 102100 }));

                        this.map.setExtent(extensionCab);
                  } else if (this.Cableado.checked == false) {

                        this.map.removeLayer(capa_cableado);

                        var extensionCab = new Extent(-560683.0447687416, 4812156.523682616, -345742.1212309296, 5014256.026468524, new SpatialReference({ wkid: 102100 }));
                  }

                  /*PRUEBA DE CÁLCULO DE ESTADÍSTICAS PARA OBTENER EL SUMATORIO DE SHAPELENGH. NO HA SALIDO BIEN*/

                  /*var estadisticas_cableado = new FeatureLayerStatistics({layer: capa_cableado})
                    var estadisticas_cableado_parametros = {field: "tipo_de_instalacion"}
                    console.log("Campos:", estadisticas_cableado_parametros)
                    estadisticas_cableado.getUniqueValues(estadisticas_cableado_parametros).then(function(resultados){
                      console.log("Suma todo el cableado:", resultados.uniqueValueInfos)
                  })*/

                  /*REALIZAMOS UNA QUERY DE LA GEOMETRIA DE LOS CABLES Y DE LOS MUNICIPIOS PARA SACAR UN LISTA DE AQUELLOS QUE NO TIENE CABLE*/
            },


            /*consultaMunis(){
            
                     /*CONSULTA AL SERVICIO DE MUNICIPIOS PARA OBTENER SUS GEOMETRIAS*/
            /*NO ES NECESARIO HACERLO*/

            /*var queryMunicipiosCableado = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/FeatureServer/0")
              var consultaMunicipios_intersect = new query();
              consultaMunicipios_intersect.returnGeometry=true;
            consultaMunicipios_intersect.outFields=["*"];
            consultaMunicipios_intersect.where = "1=1";
              queryMunicipiosCableado.execute(consultaMunicipios_intersect, lang.hitch(this, function(results){
                if(results.features.length > 0){
                  geometria_municipios = results.features[0].geometry
                  console.log("Geometria Municipios", geometria_municipios)
              }
                  }))*/

            /*var queryCableadoMunicipios = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/ServicioCableado/FeatureServer/4")
              var consultaCableado_intersect = new query();
              consultaCableado_intersect.returnGeometry=true;
            consultaCableado_intersect.outFields=["*"];
            consultaCableado_intersect.where = "1=1";
                queryCableadoMunicipios.execute(consultaCableado_intersect, lang.hitch(this, function(results){
                if(results.features.length > 0){
                  for(i=0; i<results.features.length; i++){
                    geometria_cableado = results.features[i].geometry
                   console.log("Geometria Cableado", geometria_cableado)
                 console.log("Nombre del cable", results.features[i].attributes.identificador)
                 console.log("Tipo de cable", results.features[i].attributes.tipo)
                     var queryCables = new query();
                 queryCables.returnGeometry = true;
                 queryCables.geometry = geometria_cableado;
                 queryCables.outFields = ["*"];
                 queryCables.orderByFields = ["municpio_1"]
                 queryCables.spatialRelationship = query.SPATIAL_REL_INTERSECTS
                   var munis = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/FeatureServer/0")
                   munis.queryFeatures(queryCables, lang.hitch(this, function (FeatureSet){
                    for(i=0; i<FeatureSet.features.length; i++){
                      console.log("FeatureSet", FeatureSet)
                    console.log("Municipio:", FeatureSet.features[i].attributes.municpio_1)
                      }
                  
                  
                     }))
                    }
                  
                  }
                  })
              
                  
              }*/

            añadir_centrales: function aAdir_centrales() {

                  if (this.Centrales.checked == true) {

                        capa_centrales = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/ServicioCableado/MapServer/3");

                        this.map.addLayer(capa_centrales);

                        var extension = new Extent(-452562.8682594219, 4901052.787578272, -398827.6373750154, 4951577.663274705, new SpatialReference({ wkid: 102100 }));

                        this.map.setExtent(extension);
                  } else if (this.Centrales.checked == false) {

                        this.map.removeLayer(capa_centrales);

                        var extension = new Extent(-560683.0447687416, 4812156.523682616, -345742.1212309296, 5014256.026468524, new SpatialReference({ wkid: 102100 }));
                  }
            },
            EjecutarConsulta: function EjecutarConsulta() {

                  var extensionCab = new Extent(-475455.75823086995, 4880185.478856351, -367985.29646187095, 4981235.230249394, new SpatialReference({ wkid: 102100 }));

                  var queryCableadoMunicipios = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/ServicioCableado/MapServer/4");

                  var consultaCableado_intersect = new query();

                  consultaCableado_intersect.returnGeometry = true;
                  consultaCableado_intersect.outFields = ["*"];
                  consultaCableado_intersect.where = "tipo = " + this.consultaSelect.value;
                  consultaCableado_intersect.outSpatialReference = new SpatialReference(102100);

                  console.log(consultaCableado_intersect.where);

                  queryCableadoMunicipios.execute(consultaCableado_intersect, lang.hitch(this, function (results) {

                        if (this.consultaSelect.value == -1) {

                              alert("Seleccione un tipo de cable");
                        }

                        if (results.features.length > 0 & this.consultaSelect.value == 0) {

                              this.map.graphics.clear();

                              municipiosOrdenAlfabetico = [];

                              for (i = 0; i < results.features.length; i++) {

                                    var geometria_cableado = results.features[i].geometry;
                                    console.log("Geometria Cableado", geometria_cableado);
                                    console.log("Nombre del cable", results.features[i].attributes.identificador);
                                    console.log("Tipo de cable", results.features[i].attributes.tipo);

                                    // this.map.graphics.clear();

                                    this.map.graphics.add(new graphic(geometria_cableado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([101, 133, 233]), 2), new Color([101, 226, 223])));
                                    this.map.setExtent(extensionCab);

                                    console.log(results);

                                    var queryCables = new query();

                                    queryCables.returnGeometry = true;
                                    queryCables.geometry = geometria_cableado;
                                    queryCables.outFields = ["*"];
                                    queryCables.orderByFields = ["municpio_1"];

                                    /*-----AQUÍ HE AÑADIDO LA CLAUSURA WHERE----*/

                                    /*queryCables.where = "objectid = " + this.buscador_municipios.value;*/

                                    /*------------------------------------------------*/

                                    queryCables.spatialRelationship = query.SPATIAL_REL_INTERSECTS;

                                    var munis = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

                                    /*ESTABLEZCO UNA EXPRESION DE DEFINICIÓN PARA CARGAR LA CAPA SOLO CON LA GEOMETRÍA DEL MUNICIPIO SELECCIONADO EN LA LISTA DE MUNICIPIOS*/

                                    /*munis.setDefinitionExpression("objectid =' " + this.buscador_municipios.value + "'")*/

                                    /*----------------------------------------------------*/
                                    var listavaciamunicipios = [];

                                    munis.queryFeatures(queryCables, lang.hitch(this, function (FeatureSet) {

                                          for (i = 0; i < FeatureSet.features.length; i++) {

                                                console.log("FeatureSet", FeatureSet);
                                                console.log("Municipio:", FeatureSet.features[i].attributes.municpio_1);

                                                municipio_individual = FeatureSet.features[i].attributes.municpio_1;

                                                listavaciamunicipios.push(municipio_individual);
                                          }

                                          console.log("Lista:", listavaciamunicipios);

                                          municipiosFiltrados = listavaciamunicipios.filter(function (item, pos) {

                                                return listavaciamunicipios.indexOf(item) === pos;
                                          });

                                          console.log(municipiosFiltrados);

                                          municipiosOrdenAlfabetico = municipiosFiltrados.sort();

                                          console.log("Municipios Ordenados:", municipiosOrdenAlfabetico);
                                    }));
                              };

                              /*for (i = 0; i < municipiosOrdenAlfabetico.length; i++) {            
                              
                                var contenido;
                                 var li = document.createElement("li");
                               var p = document.createElement("p");
                               contenido = municipiosOrdenAlfabetico[i];
                               p.appendChild(document.createTextNode(contenido));
                               document.getElementById("lista_municipios_con_cable").appendChild(li).appendChild(p);
                                }*/
                        } else if (results.features.length > 0 & this.consultaSelect.value == 1) {

                              this.map.graphics.clear();

                              for (i = 0; i < results.features.length; i++) {

                                    var geometria_cableado = results.features[i].geometry;
                                    console.log("Geometria Cableado", geometria_cableado);
                                    console.log("Nombre del cable", results.features[i].attributes.identificador);
                                    console.log("Tipo de cable", results.features[i].attributes.tipo);

                                    // this.map.graphics.clear();

                                    this.map.graphics.add(new graphic(geometria_cableado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([51, 225, 51]), 2), new Color([101, 226, 223])));
                                    this.map.setExtent(extensionCab);

                                    console.log(results);

                                    var queryCables = new query();
                                    queryCables.returnGeometry = true;
                                    queryCables.geometry = geometria_cableado;
                                    queryCables.outFields = ["*"];
                                    queryCables.orderByFields = ["municpio_1"];
                                    queryCables.spatialRelationship = query.SPATIAL_REL_INTERSECTS;

                                    var munis = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

                                    var listavaciamunicipios = [];

                                    munis.queryFeatures(queryCables, lang.hitch(this, function (FeatureSet) {

                                          for (i = 0; i < FeatureSet.features.length; i++) {

                                                console.log("FeatureSet", FeatureSet);
                                                console.log("Municipio:", FeatureSet.features[i].attributes.municpio_1);

                                                municipio_individual = FeatureSet.features[i].attributes.municpio_1;

                                                listavaciamunicipios.push(municipio_individual);
                                          }

                                          console.log("Lista:", listavaciamunicipios);

                                          municipiosFiltrados = listavaciamunicipios.filter(function (item, pos) {

                                                return listavaciamunicipios.indexOf(item) === pos;
                                          });

                                          console.log(municipiosFiltrados);

                                          municipiosOrdenAlfabetico = municipiosFiltrados.sort();

                                          console.log("Municipios Ordenados:", municipiosOrdenAlfabetico);
                                    }));
                              }
                        } else if (results.features.length > 0 & this.consultaSelect.value == 2) {

                              this.map.graphics.clear();
                              for (i = 0; i < results.features.length; i++) {

                                    var geometria_cableado = results.features[i].geometry;
                                    console.log("Geometria Cableado", geometria_cableado);
                                    console.log("Nombre del cable", results.features[i].attributes.identificador);
                                    console.log("Tipo de cable", results.features[i].attributes.tipo);

                                    // this.map.graphics.clear();

                                    this.map.graphics.add(new graphic(geometria_cableado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([101, 226, 223])));
                                    this.map.setExtent(extensionCab);

                                    console.log(results);

                                    var queryCables = new query();
                                    queryCables.returnGeometry = true;
                                    queryCables.geometry = geometria_cableado;
                                    queryCables.outFields = ["*"];
                                    queryCables.orderByFields = ["municpio_1"];
                                    queryCables.spatialRelationship = query.SPATIAL_REL_INTERSECTS;

                                    var munis = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

                                    var listavaciamunicipios = [];

                                    munis.queryFeatures(queryCables, lang.hitch(this, function (FeatureSet) {

                                          for (i = 0; i < FeatureSet.features.length; i++) {

                                                console.log("FeatureSet", FeatureSet);
                                                console.log("Municipio:", FeatureSet.features[i].attributes.municpio_1);

                                                municipio_individual = FeatureSet.features[i].attributes.municpio_1;

                                                listavaciamunicipios.push(municipio_individual);
                                          }

                                          console.log("Lista:", listavaciamunicipios);

                                          municipiosFiltrados = listavaciamunicipios.filter(function (item, pos) {

                                                return listavaciamunicipios.indexOf(item) === pos;
                                          });

                                          console.log(municipiosFiltrados);

                                          municipiosOrdenAlfabetico = municipiosFiltrados.sort();

                                          console.log("Municipios Ordenados:", municipiosOrdenAlfabetico);
                                    }));
                              }
                        } else if (results.features.length > 0 & this.consultaSelect.value == 3) {

                              this.map.graphics.clear();

                              for (i = 0; i < results.features.length; i++) {

                                    var geometria_cableado = results.features[i].geometry;
                                    console.log("Geometria Cableado", geometria_cableado);
                                    console.log("Nombre del cable", results.features[i].attributes.identificador);
                                    console.log("Tipo de cable", results.features[i].attributes.tipo);

                                    // this.map.graphics.clear();

                                    this.map.graphics.add(new graphic(geometria_cableado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 255]), 2), new Color([101, 226, 223])));
                                    this.map.setExtent(extensionCab);

                                    console.log(results);

                                    var queryCables = new query();
                                    queryCables.returnGeometry = true;
                                    queryCables.geometry = geometria_cableado;
                                    queryCables.outFields = ["*"];
                                    queryCables.orderByFields = ["municpio_1"];
                                    queryCables.spatialRelationship = query.SPATIAL_REL_INTERSECTS;

                                    var munis = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

                                    var listavaciamunicipios = [];

                                    munis.queryFeatures(queryCables, lang.hitch(this, function (FeatureSet) {

                                          for (i = 0; i < FeatureSet.features.length; i++) {

                                                console.log("FeatureSet", FeatureSet);
                                                console.log("Municipio:", FeatureSet.features[i].attributes.municpio_1);

                                                municipio_individual = FeatureSet.features[i].attributes.municpio_1;

                                                listavaciamunicipios.push(municipio_individual);
                                          }

                                          console.log("Lista:", listavaciamunicipios);

                                          municipiosFiltrados = listavaciamunicipios.filter(function (item, pos) {

                                                return listavaciamunicipios.indexOf(item) === pos;
                                          });

                                          console.log(municipiosFiltrados);

                                          municipiosOrdenAlfabetico = municipiosFiltrados.sort();

                                          console.log("Municipios Ordenados:", municipiosOrdenAlfabetico);
                                    }));
                              }
                        } else if (results.features.length > 0 & this.consultaSelect.value == 4) {

                              this.map.graphics.clear();

                              for (i = 0; i < results.features.length; i++) {

                                    var geometria_cableado = results.features[i].geometry;
                                    console.log("Geometria Cableado", geometria_cableado);
                                    console.log("Nombre del cable", results.features[i].attributes.identificador);
                                    console.log("Tipo de cable", results.features[i].attributes.tipo);

                                    // this.map.graphics.clear();

                                    this.map.graphics.add(new graphic(geometria_cableado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([128, 128, 128]), 2), new Color([101, 226, 223])));
                                    this.map.setExtent(extensionCab);

                                    console.log(results);

                                    var queryCables = new query();
                                    queryCables.returnGeometry = true;
                                    queryCables.geometry = geometria_cableado;
                                    queryCables.outFields = ["*"];
                                    queryCables.orderByFields = ["municpio_1"];
                                    queryCables.spatialRelationship = query.SPATIAL_REL_INTERSECTS;

                                    var munis = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

                                    var listavaciamunicipios = [];

                                    munis.queryFeatures(queryCables, lang.hitch(this, function (FeatureSet) {

                                          for (i = 0; i < FeatureSet.features.length; i++) {

                                                console.log("FeatureSet", FeatureSet);
                                                console.log("Municipio:", FeatureSet.features[i].attributes.municpio_1);

                                                municipio_individual = FeatureSet.features[i].attributes.municpio_1;

                                                listavaciamunicipios.push(municipio_individual);
                                          }

                                          console.log("Lista:", listavaciamunicipios);

                                          municipiosFiltrados = listavaciamunicipios.filter(function (item, pos) {

                                                return listavaciamunicipios.indexOf(item) === pos;
                                          });

                                          console.log(municipiosFiltrados);

                                          municipiosOrdenAlfabetico = municipiosFiltrados.sort();

                                          console.log("Municipios Ordenados:", municipiosOrdenAlfabetico);
                                    }));
                              };
                        };
                  }));
            },


            /*------------PRUEBA PARA EJECUTAR QUERY CON EL MUNICIPIO Y EL CABLEADO COMO PARAMETROS DE ENTRADA--------------*/

            EjecutarQuery: function EjecutarQuery() {

                  this.map.graphics.clear();

                  var queryMunicipios_Select = new query();

                  queryMunicipios_Select.returnGeometry = true;
                  queryMunicipios_Select.outFields = ["*"];
                  queryMunicipios_Select.orderByFields = ["municpio_1"];
                  queryMunicipios_Select.where = "objectid = " + this.buscador_municipios.value;
                  queryMunicipios_Select.outSpatialReference = new SpatialReference(102100);

                  var munis = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

                  munis.setDefinitionExpression("objectid =' " + this.buscador_municipios.value + "'");

                  var queryTaskMunicipios = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

                  queryTaskMunicipios.execute(queryMunicipios_Select, lang.hitch(this, function (resultados) {

                        if (resultados.features.length > 0) {

                              for (i = 0; i < resultados.features.length; i++) {

                                    geometria_municipio_seleccionado = resultados.features[i].geometry;

                                    nombreMunicipio_seleccionado = resultados.features[i].attributes.municpio_1;

                                    this.map.graphics.clear();
                                    this.map.graphics.add(new graphic(geometria_municipio_seleccionado, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASH, new Color([234, 152, 223]), 2), new Color([235, 141, 106, 0.25]))));
                              }

                              console.log("Geoemtria Municipio seleccionado:", geometria_municipio_seleccionado);

                              console.log("Municipio seleccionado;", nombreMunicipio_seleccionado);

                              /*DEFINIMOS UNA NUEVA QUERY PARA EL SERVICIO DE CABLEADO PASANDOLE COMO GEOMETRIA DE ENTRADA LA DEL MUNICIPIO SELECCIONADO EN LA LISTA DE MUNICIPIOS: geometria_municipio_seleccionado*/

                              var consulta_Cableado = new query();

                              consulta_Cableado.returnGeometry = true;
                              consulta_Cableado.geometry = geometria_municipio_seleccionado;
                              consulta_Cableado.outFields = ["*"];
                              consulta_Cableado.where = "tipo = " + this.consultaSelect.value;
                              consulta_Cableado.spatialRelationship = query.SPATIAL_REL_INTERSECTS;

                              var capaCableadoquery = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/ServicioCableado/MapServer/4");

                              var identificadorFibra = [];
                              var identificadorCobre = [];
                              var identificadorCoaxial = [];
                              var identificadorHFC = [];
                              var identificadorOtros = [];
                              var identificadorFibraOrdenados = identificadorFibra.sort();
                              var identificadorCobreOrdenados = identificadorCobre.sort();
                              var identificadorCoaxialOrdenados = identificadorCoaxial.sort();
                              var identificadorHFCOrdenados = identificadorHFC.sort();
                              var identificadorOtrosOrdenados = identificadorOtros.sort();

                              capaCableadoquery.queryFeatures(consulta_Cableado, lang.hitch(this, function (EVT) {

                                    if (EVT.features.length > 0 & this.consultaSelect.value == 0) {

                                          // this.map.graphics.clear();

                                          for (i = 0; i < EVT.features.length; i++) {

                                                console.log("EVT:", EVT);

                                                var geometria_cableado_seleccionado = EVT.features[i].geometry;
                                                var identificador = EVT.features[i].attributes.identificador;

                                                this.map.graphics.add(new graphic(geometria_cableado_seleccionado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([101, 133, 233]), 2), new Color([101, 226, 223])));

                                                identificadorFibra.push(identificador);
                                          }

                                          for (i = 0; i < identificadorFibraOrdenados.length; i++) {

                                                var li = document.createElement("li");
                                                var p = document.createElement("p");
                                                contenido = identificadorFibraOrdenados[i];
                                                p.appendChild(document.createTextNode(contenido));
                                                document.getElementById("lista_cables_por_municipio_Fibra").appendChild(li).appendChild(p);
                                          }

                                          this.map.setExtent(geometria_municipio_seleccionado.getExtent(), true);

                                          console.log("Identificadores de fibra;", identificadorFibra);
                                    } else if (EVT.features.length == 0 & this.consultaSelect.value == 0) {

                                          alert("En " + nombreMunicipio_seleccionado + " no existe instalación de Fibra ");
                                    }

                                    if (EVT.features.length > 0 & this.consultaSelect.value == 1) {

                                          // this.map.graphics.clear();

                                          for (i = 0; i < EVT.features.length; i++) {

                                                console.log("EVT:", EVT);

                                                var geometria_cableado_seleccionado = EVT.features[i].geometry;
                                                var identificador = EVT.features[i].attributes.identificador;

                                                this.map.graphics.add(new graphic(geometria_cableado_seleccionado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([51, 225, 51]), 2), new Color([101, 226, 223])));

                                                identificadorCobre.push(identificador);
                                          }

                                          for (i = 0; i < identificadorCobreOrdenados.length; i++) {

                                                var li = document.createElement("li");
                                                var p = document.createElement("p");
                                                contenido = identificadorCobreOrdenados[i];
                                                p.appendChild(document.createTextNode(contenido));
                                                document.getElementById("lista_cables_por_municipio_Cobre").appendChild(li).appendChild(p);
                                          }

                                          this.map.setExtent(geometria_municipio_seleccionado.getExtent(), true);

                                          console.log("Identificadores de Cobre;", identificadorCobre);
                                    } else if (EVT.features.length == 0 & this.consultaSelect.value == 1) {

                                          alert("En " + nombreMunicipio_seleccionado + " no existe instalación de Cobre ");
                                    }

                                    if (EVT.features.length > 0 & this.consultaSelect.value == 2) {

                                          // this.map.graphics.clear();

                                          for (i = 0; i < EVT.features.length; i++) {

                                                console.log("EVT:", EVT);

                                                var geometria_cableado_seleccionado = EVT.features[i].geometry;
                                                var identificador = EVT.features[i].attributes.identificador;

                                                this.map.graphics.add(new graphic(geometria_cableado_seleccionado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([101, 226, 223])));

                                                identificadorHFC.push(identificador);
                                          }

                                          for (i = 0; i < identificadorHFCOrdenados.length; i++) {

                                                var li = document.createElement("li");
                                                var p = document.createElement("p");
                                                contenido = identificadorHFCOrdenados[i];
                                                p.appendChild(document.createTextNode(contenido));
                                                document.getElementById("lista_cables_por_municipio_HFC").appendChild(li).appendChild(p);
                                          }

                                          console.log("Identificadores de HFC;", identificadorHFC);

                                          this.map.setExtent(geometria_municipio_seleccionado.getExtent(), true);
                                    } else if (EVT.features.length == 0 & this.consultaSelect.value == 2) {

                                          alert("En " + nombreMunicipio_seleccionado + " no existe instalación de cable HFC ");
                                    }

                                    if (EVT.features.length > 0 & this.consultaSelect.value == 3) {

                                          // this.map.graphics.clear();

                                          for (i = 0; i < EVT.features.length; i++) {

                                                console.log("EVT:", EVT);

                                                var geometria_cableado_seleccionado = EVT.features[i].geometry;
                                                var identificador = EVT.features[i].attributes.identificador;

                                                this.map.graphics.add(new graphic(geometria_cableado_seleccionado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 255]), 2), new Color([101, 226, 223])));

                                                identificadorCoaxial.push(identificador);
                                          }

                                          for (i = 0; i < identificadorCoaxialOrdenados.length; i++) {

                                                var li = document.createElement("li");
                                                var p = document.createElement("p");
                                                contenido = identificadorCoaxialOrdenados[i];
                                                p.appendChild(document.createTextNode(contenido));
                                                document.getElementById("lista_cables_por_municipio_Coaxial").appendChild(li).appendChild(p);
                                          }

                                          console.log("Identificadores de Coaxial;", identificadorCoaxial);

                                          this.map.setExtent(geometria_municipio_seleccionado.getExtent(), true);
                                    } else if (EVT.features.length == 0 & this.consultaSelect.value == 3) {

                                          alert("En " + nombreMunicipio_seleccionado + " no existe instalación de cable Coaxial ");
                                    }

                                    if (EVT.features.length > 0 & this.consultaSelect.value == 4) {

                                          // this.map.graphics.clear();

                                          for (i = 0; i < EVT.features.length; i++) {

                                                console.log("EVT:", EVT);

                                                var geometria_cableado_seleccionado = EVT.features[i].geometry;
                                                var identificador = EVT.features[i].attributes.identificador;

                                                this.map.graphics.add(new graphic(geometria_cableado_seleccionado, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([128, 128, 128]), 2), new Color([101, 226, 223])));

                                                identificadorOtros.push(identificador);
                                          }

                                          for (i = 0; i < identificadorOtrosOrdenados.length; i++) {

                                                var li = document.createElement("li");
                                                var p = document.createElement("p");
                                                contenido = identificadorOtrosOrdenados[i];
                                                p.appendChild(document.createTextNode(contenido));
                                                document.getElementById("lista_cables_por_municipio_Otros").appendChild(li).appendChild(p);
                                          }

                                          console.log("Identificadores de Otros;", identificadorOtros);

                                          this.map.setExtent(geometria_municipio_seleccionado.getExtent(), true);
                                    }
                              }));
                        }
                  }));
            },
            restaurar: function restaurar() {

                  this.map.graphics.clear();

                  var extension_incial_mapa = new Extent(-569639.5596264448, 4841429.503604539, -354392.88797539903, 5043529.006390534, new SpatialReference({ wkid: 102100 }));

                  this.map.setExtent(extension_incial_mapa);
                  this.map.removeLayer(capa_conductos);
            },


            onClose: function onClose() {
                  this.map.graphics.clear();
            }

            // onMinimize: function(){
            //   console.log('Filtro_DC::onMinimize');
            // },

            // onMaximize: function(){
            //   console.log('Filtro_DC::onMaximize');
            // },

            // onSignIn: function(credential){
            //   console.log('Filtro_DC::onSignIn', credential);
            // },

            // onSignOut: function(){
            //   console.log('Filtro_DC::onSignOut');
            // }

            // onPositionChange: function(){
            //   console.log('Filtro_DC::onPositionChange');
            // },

            // resize: function(){
            //   console.log('Filtro_DC::resize');
            // }

            //methods to communication between widgets:

      });
});
//# sourceMappingURL=Widget.js.map
