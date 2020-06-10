window.onload = function() {
    var viewModel = {
        vectorMapOptions: {
            bounds: [-118, 52, -80, 20],
            layers: [{
                dataSource: DevExpress.viz.map.sources.usa,
                borderColor: "#ffffff",
                hoverEnabled: false
            }, {
                type: "marker",
                elementType: "image",
                dataField: "url",
                size: 51,
                label: {
                    dataField: "text",
                    font: {
                        size: 14
                    }
                },
                dataSource: weatherData
            }],
            loadingIndicator: {
                show: true
            }
        }
    };
    
    ko.applyBindings(viewModel, $("#vector-map-demo").get(0));
};