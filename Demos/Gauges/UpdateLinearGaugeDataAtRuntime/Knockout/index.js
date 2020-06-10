window.onload = function() {
    var temperature = ko.observable(cities[0].data.temperature),
        humidity = ko.observable(cities[0].data.humidity),
        pressure = ko.observable(cities[0].data.pressure);
    
    var viewModel = {
        temperatureGauge: {
            value: temperature,
            title: {
               text: "Temperature (°C)",
               font: {
                  size: 16
               }
            },
            geometry: { orientation: "vertical" },
            scale: {
                startValue: -40, 
                endValue: 40,
                tickInterval: 40
            },
            rangeContainer: {
                backgroundColor: "none",
                ranges: [
                    { startValue: -40, endValue: 0, color: "#679EC5" },
                    { startValue: 0, endValue: 40 }
                ]
            }
        },
        humidityGauge: {
            value: humidity,
            title: {
               text: "Humidity (%)",
               font: {
                  size: 16
               }
            },
            geometry: { orientation: "vertical" },
            scale: {
                startValue: 0, 
                endValue: 100,
                tickInterval: 10,
            },
            rangeContainer: { backgroundColor: "#CACACA" },
            valueIndicator: { type: "rhombus", color: "#A4DDED" }
        },
        pressureGauge: {
            value: pressure,
            title: {
               text: "Barometric Pressure (mb)",
               font: {
                  size: 16
               }
            },
            geometry: { orientation: "vertical" },
            scale: {
                label: {
                    format: {
                        type: "decimal"
                    }
                },
                startValue: 900, endValue: 1100,
                customTicks: [900, 1000, 1020, 1100]
            },
            rangeContainer: {
                ranges: [
                    { startValue: 900, endValue: 1000, color: "#679EC5" },
                    { startValue: 1000, endValue: 1020, color: "#A6C567" },
                    { startValue: 1020, endValue: 1100, color: "#E18E92" }
                ]
            },
            valueIndicator: { type: "circle", color: "#E3A857" }
        },
        selectBoxOptions: {
            dataSource: cities,
            displayExpr: "name",
            onValueChanged: function(e) {
                temperature(e.value.data.temperature);
                humidity(e.value.data.humidity);
                pressure(e.value.data.pressure);
            },
            value: cities[0]
        }
    };
    
    ko.applyBindings(viewModel, $("#gauge-demo").get(0));
};