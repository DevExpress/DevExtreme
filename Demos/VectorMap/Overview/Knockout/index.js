window.onload = function() {
    var format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;

    var viewModel = {
        vectorMapOptions: {
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
                    elements.forEach(function (element) {
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
                customizeTooltip: function (arg) {
                    var countryGDPData = countriesGDP[arg.attribute("name")];
                
                    var node = $("<div>")
                        .append("<h4>" + arg.attribute("name") + "</h4>")
                        .append("<div id='nominal'></div>")
                        .append("<div id='gdp-sectors'></div>");
                
                    var total = countryGDPData && countryGDPData.total;
                    if (total)
                        node.find("#nominal").text("Nominal GDP: $" + format(total) + "M");
                
                    return {
                        html: node.html()
                    };
                }
            },
            onTooltipShown: function (e) {
                var name = e.target.attribute("name"),
                    GDPData = [
                        { name: "industry", value: countriesGDP[name].industry },
                        { name: "services", value: countriesGDP[name].services },
                        { name: "agriculture", value: countriesGDP[name].agriculture }
                    ],
                    container = $("#gdp-sectors");
                if (countriesGDP[name].services) {
                    container.dxPieChart({
                        dataSource: GDPData,
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
                    container.text("No economic development data");
                }
            },
            bounds: [-180, 85, 180, -60]
        }
    };
    
    ko.applyBindings(viewModel, $("#vector-map-demo").get(0));
};