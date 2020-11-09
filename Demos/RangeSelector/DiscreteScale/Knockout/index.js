window.onload = function() {
    var totalResult = ko.observable("12,809,000");
    
    var viewModel = {
        totalResult: totalResult,
        rangeSelectorOptions: {
            dataSource: dataSource,
            chart: {
                commonSeriesSettings: {
                    argumentField: "country",
                    type: "bar"
                },
                series: [
                    { valueField: "copper", name: "Copper" }
                ]
            },
            title: "Copper Production in 2013",
            onValueChanged: function (e) {
                var data = e.component.option("dataSource"),
                    total = 0,
                    startIndex,
                    endIndex;
    
                data.forEach(function(item, i){
                    if (item.country == e.value[0] )
                        startIndex = i;
                    else if (item.country == e.value[1])
                        endIndex = i;
                });
    
                if(endIndex) {
                    data
                        .slice(startIndex, endIndex + 1)
                        .forEach(function(item){
                            total += item.copper;
                        });
                }
                else {
                    total = data[startIndex].copper;
                }
    
                totalResult(formatNumber(total));
            }
        }
    };

    var formatNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format;
    
    ko.applyBindings(viewModel, $("#range-selector-demo").get(0));
};