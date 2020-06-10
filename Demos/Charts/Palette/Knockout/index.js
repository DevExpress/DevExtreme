window.onload = function() {
    var palette = ko.observable(paletteCollection[0]),
        paletteExtensionMode = ko.observable("Blend"),
        viewModel = {
            chartOptions: {
                palette: palette,
                dataSource: dataSource,
                series: {},
                paletteExtensionMode: paletteExtensionMode,
                legend: {
                    visible: false
                }
            },

            paletteSelectBoxOptions: {
                items: paletteCollection,
                value: palette
            },

            extensionModeSelectBoxOptions: {
                items: paletteExtensionModes,
                value: paletteExtensionMode
            },

            baseColors: ko.computed(function() { 
                return DevExpress.viz.getPalette(palette()).simpleSet; 
            })
        };

    ko.applyBindings(viewModel, document.getElementById("chart-demo"));
};