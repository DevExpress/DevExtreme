$(function() {
    $("#chart").dxChart({
        dataSource: populationData,
        title: "Top 5 Most Populated States in US",
        series: {
            type: "bar",
            argumentField: "name",
            valueField: "population",
            name: "Population"
        },
        legend: {
            visible: false
        },
        commonAnnotationSettings: {
            type: "custom",
            series: "Population",
            allowDragging: true,
            template: function(annotation, container) {
                var data = annotation.data;
                $("<svg class='annotation'>" +
                    "<image href='../../../../images/flags/" +
                    data.name.replace(/\s/, "").toLowerCase() + ".gif' width='60' height='40' />" +
                    "<text x='70' y='25' class='state'>" +
                    annotation.argument + "</text>" +
                    "<text x='0' y='60'>" +
                    "<tspan class='caption'>Capital:</tspan>" +
                    "<tspan dx='5'>" + data.capital + "</tspan>" +
                    "<tspan dy='14' x='0' class='caption'>Population:</tspan>" +
                    "<tspan dx='5'>" + Globalize.formatNumber(data.population, { maximumFractionDigits: 0 }) + "</tspan>" +
                    "<tspan dy='14' x='0' class='caption'>Area:</tspan>" +
                    "<tspan dx='5'>" + Globalize.formatNumber(data.area, { maximumFractionDigits: 0 }) + "</tspan>" +
                    "<tspan dx='5'>km</tspan><tspan dy='-2' class='sup'>2</tspan>" +
                    "</text></svg>").appendTo(container);
            }
        },
        annotations: $.map(populationData, function(data) { 
            return {
                argument: data.name,
                data: data
            };
        })
    });
});