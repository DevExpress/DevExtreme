var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.pieChartOptions = {
        palette: "bright",
        dataSource: states,
        title: "Top 10 Most Populated States in US",
        series: {
            argumentField: "name",
            valueField: "population"
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            contentTemplate: function(info, $container) {
                var container = $container[0];
                
                    container.innerHTML = ["<div class='state-tooltip'><img src='../../../../images/flags/" +
                        info.point.data.name.replace(/\s/, "") + ".svg' />",
                        "<h4 class='state'></h4>",
                        "<div class='capital'><span class='caption'>Capital</span>: </div>",
                        "<div class='population'><span class='caption'>Population</span>: </div>",
                        "<div><span class='caption'>Area</span>: ",
                        "<span class='area-km'></span> km<sup>2</sup> (",
                        "<span class='area-mi'></span> mi<sup>2</sup>)",
                        "</div></div>"
                    ].join("");
                    
                    container.querySelector(".state").textContent = info.argument;
                    container.querySelector(".capital").append(document.createTextNode(info.point.data.capital));
                    container.querySelector(".population").append(document.createTextNode(formatNumber(info.value) + " people"));
                    container.querySelector(".area-km").textContent = formatNumber(info.point.data.area);
                    container.querySelector(".area-mi").textContent = formatNumber(0.3861 * info.point.data.area);
            }
        }
    };
});
var formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;