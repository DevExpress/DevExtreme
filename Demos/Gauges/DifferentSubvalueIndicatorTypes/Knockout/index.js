window.onload = function() {
    var geometry = {
            startAngle: 180, 
            endAngle: 0
        },
        scale = {
            startValue: 0,
            endValue: 10,
            tickInterval: 1
        };
    
    var viewModel = {
        triangleMarkerIndicator: {
            geometry: geometry,
            scale: scale,
            value: 8,
            subvalues: [2, 8],
            subvalueIndicator: {
                type: "triangleMarker",
                color: "#8FBC8F"
            }
        },
        rectangleNeedleIndicator: {
            geometry: geometry,
            scale: scale,
            value: 9,
            subvalues: [2, 8],
            subvalueIndicator: {
                type: "rectangleNeedle",
                color: "#9B870C"
            }
        },
        triangleNeedleIndicator: {
            geometry: geometry,
            scale: scale,
            value: 5,
            subvalues: [2, 8],
            subvalueIndicator: {
                type: "triangleNeedle",
                color: "#779ECB"
            }
        },
        textCloudIndicator: {
            geometry: geometry,
            scale: scale,
            value: 6,
            subvalues: [2, 8],
            subvalueIndicator: {
                type: "textCloud",
                color: "#f05b41"
            }
        },
        twoColorNeedleIndicator: {
            geometry: geometry,
            scale: scale,
            value: 4,
            subvalues: [2, 8],
            subvalueIndicator: {
                type: "twoColorNeedle",
                color: "#779ECB",
                secondColor: "#734F96"
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("gauge-demo"));
};