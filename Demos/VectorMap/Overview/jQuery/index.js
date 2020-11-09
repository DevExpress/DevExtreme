$(function(){
    var format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;

    $("#vector-map").dxVectorMap({
        layers: {
            name: "areas",
            dataSource: DevExpress.viz.map.sources.world,
            colorGroups: [0, 10000, 50000, 100000, 500000, 1000000, 10000000, 50000000],
            colorGroupingField: "total",
            label: {
                enabled: true,
                dataField: "name"
            },
            customize: function (elements) {
                $.each(elements, function (_, element) {
                    var countryGDPData = countriesGDP[element.attribute("name")];
                    element.attribute("total", countryGDPData && countryGDPData.total || 0);
                });
            }        
        },
        legends: [{
            source: { layer: "areas", grouping: "color" },
            customizeText: function (arg) {
                return format(arg.start) + " to " + format(arg.end);
            }
        }],
        title: {
            text: "Nominal GDP",
            subtitle: {
                text: "(in millions of US dollars)"
            }
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            contentTemplate: function(info, container) {
                var name = info.attribute("name");
                var countryGDPData = countriesGDP[name];

                var node = $("<div>")
                    .append("<h4>" + name + "</h4>")
                    .appendTo(container);
                
                var total = countryGDPData && countryGDPData.total;
                if (total) {
                    $("<div id='nominal'></div>")
                        .text("Nominal GDP: $" + format(total) + "M")
                        .appendTo(node);
                }
                if (countryGDPData) {
                    var GDPData = [
                        { name: "industry", value: countriesGDP[name].industry },
                        { name: "services", value: countriesGDP[name].services },
                        { name: "agriculture", value: countriesGDP[name].agriculture }
                    ];
                    $("<div id='gdp-sectors'></div>")
                        .appendTo(node)
                        .dxPieChart({
                            dataSource: GDPData,
                            animation: false,
                            series: [{
                                valueField: "value",
                                argumentField: "name",
                                label: {
                                    visible: true,
                                    connector: {
                                        visible: true,
                                        width: 1
                                    },
                                    customizeText: function(pointInfo) {
                                        return pointInfo.argument[0].toUpperCase()
                                            + pointInfo.argument.slice(1)
                                            + ": $" + pointInfo.value + "M";
                                    }
                                }
                            }],
                            legend: {
                                visible: false
                            }
                        });
                } else { 
                    node.append("<div>No economic development data</div>")
                }
            }
        },
        bounds: [-180, 85, 180, -60]
    });
});