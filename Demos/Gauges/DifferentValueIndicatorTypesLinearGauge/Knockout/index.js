window.onload = function() {
    var scale = {
        startValue: 0, endValue: 100,
        tickInterval: 50,
        label: {
            customizeText: function (arg) {
                return arg.valueText + " %";
            }
        }
    };
    
    var viewModel = {
        rectangleIndicator: {
            scale: scale,
            value: 75,
            valueIndicator: {
                type: "rectangle",
                color: "#9B870C"
            }
        },
        rhombusIndicator: {
            scale: scale,
            value: 80,
            valueIndicator: {
                type: "rhombus",
                color: "#779ECB"
            }
        },
        circleIndicator: {
            scale: scale,
            value: 65,
            valueIndicator: {
                type: "circle",
                color: "#8FBC8F"
            }
        },
        rangebarIndicator: {
            scale: scale,
            value: 90,
            valueIndicator: {
                type: "rangebar",
                color: "#483D8B"
            }
        },
        textCloudIndicator: {
            scale: scale,
            value: 70,
            valueIndicator: {
                type: "textCloud",
                color: "#734F96"
            }
        },
        triangleMarkerIndicator: {
            scale: scale,
            value: 85,
            valueIndicator: {
                type: "triangleMarker",
                color: "#f05b41"
            }
        }
    };
    
    ko.applyBindings(viewModel, $("#gauge-demo").get(0));
};