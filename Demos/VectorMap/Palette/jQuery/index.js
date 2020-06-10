$(function(){
    $("#vector-map").dxVectorMap({
        bounds: [-180, 85, 180, -60],
        layers: {
            name: "areas",
            dataSource: DevExpress.viz.map.sources.world,
            palette: "Violet",
            colorGroups: [0, 0.5, 0.8, 1, 2, 3, 100],
            colorGroupingField: "population",
            customize: function (elements) {
                $.each(elements, function (_, element) {
                    element.attribute("population", populations[element.attribute("name")]);
                });
            }
        },
        legends: [{
            source: { layer: "areas", grouping: "color" },
            customizeText: function (arg) {
                var text;
                if (arg.index === 0) {
                    text = "< 0.5%";
                }
                else if (arg.index === 5) {
                    text = "> 3%";
                }
                else {
                    text = arg.start + "% to " + arg.end + "%";
                }
                return text;
            }
        }],
        tooltip: {
            enabled: true,
            customizeTooltip: function(arg) {
                if (arg.attribute("population")) {
                    return { text: arg.attribute("name") + ": " + arg.attribute("population") + "% of world population" };
                }
            }
        }
    });
});