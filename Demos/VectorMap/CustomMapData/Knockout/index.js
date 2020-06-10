window.onload = function() {
    var viewModel = {
        vectorMapOptions: {
            title: {
                text: "Map of Pangaea",
                subtitle: "with modern continental outlines"
            },
            maxZoomFactor: 2,
            projection: {
                to: function (coordinates) {
                    return [coordinates[0] / 100, coordinates[1] / 100];
                },
                from: function (coordinates) {
                    return [coordinates[0] * 100, coordinates[1] * 100];
                }
            },
            "export": {
                enabled: true
            },
            layers: [{
                dataSource: pangaeaBorders,
                hoverEnabled: false,
                name: "pangaea",
                color: "#bb7862"
            }, {
                dataSource: pangaeaContinents,
                customize: function (elements) {
                    elements.forEach(function (element) {
                        element.applySettings({
                            color: element.attribute("color")
                        });
                    });
                },
                label: {
                    enabled: true,
                    dataField: "name"
                },
                name: "continents"
            }]
        }
    };
    
    ko.applyBindings(viewModel, $("#vector-map-demo").get(0));
};