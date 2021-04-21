define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/renderers/HeatmapRenderer", "esri/layers/FeatureLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/dijit/HeatmapSlider", "dojo/_base/lang", "esri/layers/ArcGISDynamicMapServiceLayer"], function (declare, BaseWidget, HeatmapRenderer, FeatureLayer, Extent, SpatialReference, HeatmapSlider, lang, DynamicLayer) {

      var capa_clientes = void 0;
      var capa_clientes_options;
      var capa_clientes_calor = void 0;
      var deslizadorColor;
      var myStops;

      //To create a widget, you need to derive from BaseWidget.
      return declare([BaseWidget], {

            // Custom widget code goes here

            baseClass: 'distribucion-clientes',
            // this property is set by the framework when widget is loaded.
            // name: 'Distribucion_Clientes',
            // add additional properties here

            //methods to communication with app container:
            postCreate: function postCreate() {
                  this.inherited(arguments);
                  console.log('Distribucion_Clientes::postCreate');

                  /*var capa_dinamica_renta_map_server = new DynamicLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer")
                    this.map.addLayer(capa_dinamica_renta_map_server)*/
            },

            startup: function startup() {
                  this.inherited(arguments);
                  console.log('Distribucion_Clientes::startup');
                  mimapa = this.map;
                  
            },

            onOpen: function onOpen() {

                  console.log('Distribucion_Clientes::onOpen');

                  

                  capa_clientes_options = {
                        mode: FeatureLayer.MODE_SNAPSHOT

                  };

                  capa_clientes = new FeatureLayer("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Clientes/FeatureServer/0", capa_clientes_options);

                  this.map.addLayer(capa_clientes);

                  var extension = new Extent(-469129.1882000007, 4868948.761299998, -345686.1994000003, 5001644.391199999, new SpatialReference({ wkid: 102100 }));

                  this.map.setExtent(extension);

                  myStops = [{ "ratio": 0, "color": {
                              "r": 133, "g": 193, "b": 200, "a": 0 }
                  }, { "ratio": 0.01, "color": {
                              "r": 133, "g": 193, "b": 200, "a": 0 }
                  }, { "ratio": 0.01, "color": {
                              "r": 133, "g": 193, "b": 200, "a": 0.7 }
                  }, { "ratio": 0.01, "color": {
                              "r": 133, "g": 193, "b": 200, "a": 0.7 }
                  }, { "ratio": 0.0925, "color": {
                              "r": 144, "g": 161, "b": 190, "a": 0.7 }
                  }, { "ratio": 0.17500000000000002, "color": {
                              "r": 156, "g": 129, "b": 132, "a": 0.7 }
                  }, { "ratio": 0.2575, "color": {
                              "r": 167, "g": 97, "b": 170, "a": 0.7 }
                  }, { "ratio": 0.34, "color": {
                              "r": 175, "g": 73, "b": 128, "a": 0.7 }
                  }, { "ratio": 0.42250000000000004, "color": {
                              "r": 184, "g": 48, "b": 85, "a": 0.7 }
                  }, { "ratio": 0.505, "color": {
                              "r": 192, "g": 24, "b": 42, "a": 0.7 }
                  }, { "ratio": 0.5875, "color": {
                              "r": 200, "g": 0, "b": 0, "a": 0.7 }
                  }, { "ratio": 0.67, "color": {
                              "r": 211, "g": 51, "b": 0, "a": 0.7 }
                  }, { "ratio": 0.7525000000000001, "color": {
                              "r": 222, "g": 102, "b": 0, "a": 0.7 }
                  }, { "ratio": 0.8350000000000001, "color": {
                              "r": 233, "g": 153, "b": 0, "a": 0.7 }
                  }, { "ratio": 0.9175000000000001, "color": {
                              "r": 244, "g": 204, "b": 0, "a": 0.7 }
                  }, { "ratio": 1, "color": {
                              "r": 255, "g": 255, "b": 0, "a": 0.7 }
                  }];

                  var mangos = [3, 15];

                  deslizadorColor = new HeatmapSlider({
                        "colorStops": myStops,
                        "hansles": mangos,
                        "showLabels": true
                  }, this.deslizador);

                  deslizadorColor.startup();
            },

            MapaCalor: function MapaCalor() {

                  

                  var calorRender = new HeatmapRenderer({                        
                        blurRadius: this.radioSelect.value,
                        maxPixelIntensity: this.maxpx.value,
                        minPixelIntensity: this.minpx.value,
                        colorStops: myStops });

                  calorRender.setColorStops(myStops);

                  if (this.maxpx.value != 0 & this.minpx.value != 0 & this.radioSelect.value != 0) {

                        capa_clientes_calor = capa_clientes.setRenderer(calorRender);

                        

                        this.map.addLayer(capa_clientes_calor);
                  } else {

                        alert("Introduce el radio del círculo, los valores máximos y mínimos de los píxeles");
                  };
                  
                  

                  

            },
            actualizar: function actualizar() {

                  calorRender.setColorStops(myStops);
                  capa_clientes.setRenderer(calorRender);
                  capa_clientes.redraw();
            },


            /*Cada vez que se realiza el cálculo, los valores de desenfoque se suman a los píxeles subyacentes. Los resultados son acumulativos, por lo que un píxel que tenga varios puntos cerca tendrá un valor más alto que un píxel con un solo punto. Este valor acumulado se denomina intensidad del píxel."*/

            onClose: function onClose() {

                  

                  this.map.removeLayer(capa_clientes);

                  
            }

            // onMinimize: function(){
            //   console.log('Distribucion_Clientes::onMinimize');
            // },

            // onMaximize: function(){
            //   console.log('Distribucion_Clientes::onMaximize');
            // },

            // onSignIn: function(credential){
            //   console.log('Distribucion_Clientes::onSignIn', credential);
            // },

            // onSignOut: function(){
            //   console.log('Distribucion_Clientes::onSignOut');
            // }

            // onPositionChange: function(){
            //   console.log('Distribucion_Clientes::onPositionChange');
            // },

            // resize: function(){
            //   console.log('Distribucion_Clientes::resize');
            // }

            //methods to communication between widgets:

      });
});
//# sourceMappingURL=Widget.js.map
