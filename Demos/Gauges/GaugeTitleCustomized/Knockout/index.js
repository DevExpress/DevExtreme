window.onload = function() {
    var viewModel = {
        gaugeOptions: {
            scale: {
                startValue: 0, 
                endValue: 10,
                tickInterval: 2
            },
            value: 7,
            title: {
                text: "Amount of Produced Gold (Kilos)",
                horizontalAlignment: "center",
                verticalAlignment: "bottom",
                font: {
                    size: 30,
                    color: "#CFB53B"
                },
                margin: {
                    top: 25
                }
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("gauge-demo"));
};