define(['dojo/_base/declare', 'jimu/BaseWidget', "dojo/_base/lang", "esri/tasks/QueryTask", "esri/tasks/query", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/symbols/SimpleLineSymbol", "esri/SpatialReference"], function (declare, BaseWidget, lang, QueryTask, query, graphic, SimpleFillSymbol, Color, SimpleLineSymbol, SpatialReference) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {

        // Custom widget code goes here

        baseClass: 'nuevas-oportunidades',
        // this property is set by the framework when widget is loaded.
        // name: 'Nuevas_Oportunidades',
        // add additional properties here

        //methods to communication with app container:
        postCreate: function postCreate() {
            this.inherited(arguments);
            console.log('Nuevas_Oportunidades::postCreate');
        },

        startup: function startup() {
            this.inherited(arguments);
            console.log('Nuevas_Oportunidades::startup');
        },

        onOpen: function onOpen() {
            console.log('Nuevas_Oportunidades::onOpen');
        },

        ConsultaRenta: function ConsultaRenta() {

            this.map.graphics.clear();

            var RentaTask = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

            var Rentaquery = new query();
            Rentaquery.returnGeometry = true;
            Rentaquery.outFields = ["*"];
            Rentaquery.where = "sum_renta_ >" + this.RentaMin.value + " AND " + " sum_renta_ < " + this.RentaMax.value;

            console.log("Query renta:", Rentaquery);

            var ArrayRenta = [];

            RentaTask.execute(Rentaquery, lang.hitch(this, function (evt) {

                if (evt.features.length > 0) {

                    console.log(evt);

                    for (i = 0; i < evt.features.length; i++) {

                        var geometriamunis = evt.features[i].geometry;
                        this.map.graphics.add(new graphic(geometriamunis, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT, new Color([0, 0, 255]), 2), new Color([235, 141, 106, 0.25]))));

                        console.log(evt.features[i].attributes.municpio_1);

                        var Municipos_Query = evt.features[i].attributes.municpio_1;

                        ArrayRenta.push(Municipos_Query);

                        console.log("geometria:", geometriamunis);
                    }

                    console.log(ArrayRenta);
                }
            }));
        },
        ConsultaHabitantes: function ConsultaHabitantes() {

            this.map.graphics.clear();

            var HabitantesTask = new QueryTask("https://localhost:6443/arcgis/rest/services/Proyecto/Servicio_Densidad_Renta_Com_Madrid/MapServer/0");

            var HabitantesQuery = new query();
            HabitantesQuery.returnGeometry = true;
            HabitantesQuery.outFields = ["municpio_1", "sum_pob_to"];
            HabitantesQuery.outSpatialReference = new SpatialReference(102100);
            HabitantesQuery.where = "sum_pob_to >=" + this.Habitantes.value;

            HabitantesTask.execute(HabitantesQuery, lang.hitch(this, function (evt) {

                if (evt.features.length > 0) {

                    for (i = 0; i < evt.features.length; i++) {
                        var geometriaClientes = evt.features[i].geometry;
                        this.map.graphics.add(new graphic(geometriaClientes, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT, new Color([0, 255, 0]), 2), new Color([235, 141, 106, 0.25]))));
                    }
                }
            }));
        },


        onClose: function onClose() {
            this.map.graphics.clear();
        }

        // onMinimize: function(){
        //   console.log('Nuevas_Oportunidades::onMinimize');
        // },

        // onMaximize: function(){
        //   console.log('Nuevas_Oportunidades::onMaximize');
        // },

        // onSignIn: function(credential){
        //   console.log('Nuevas_Oportunidades::onSignIn', credential);
        // },

        // onSignOut: function(){
        //   console.log('Nuevas_Oportunidades::onSignOut');
        // }

        // onPositionChange: function(){
        //   console.log('Nuevas_Oportunidades::onPositionChange');
        // },

        // resize: function(){
        //   console.log('Nuevas_Oportunidades::resize');
        // }

        //methods to communication between widgets:

    });
});
//# sourceMappingURL=Widget.js.map
