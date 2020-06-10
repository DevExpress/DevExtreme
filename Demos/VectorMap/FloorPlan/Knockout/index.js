window.onload = function() {
    var viewModel = {
        vectorMapOptions: {
            maxZoomFactor: 4,
            projection: {
                to: function (coordinates) {
                    return [coordinates[0] / 100, coordinates[1] / 100];
                },
    
                from: function (coordinates) {
                    return [coordinates[0] * 100, coordinates[1] * 100];
                }
            },
            layers: [{
                hoverEnabled: false,
                dataSource: buildingData,
                name: "building"
            }, {
                color: "transparent",
                borderWidth: 1,
                label: {
                    enabled: true,
                    dataField: "name"
                },
                dataSource: roomsData,
                name: "rooms"
            }],
            tooltip: {
                enabled: true,
                customizeTooltip: function (arg) {
                    if(arg.layer.name === "rooms")
                        return { text: "Square: " + arg.attribute("square") + " ft&#178" };
                }
            }
        }
    };
    
    ko.applyBindings(viewModel, $("#vector-map-demo").get(0));
};