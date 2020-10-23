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
                var contentItems = ["<svg class='annotation'>",
                "<image href='../../../../images/flags/",
                data.name.replace(/\s/, "").toLowerCase(), ".svg' width='60' height='40' />",
                "<rect class='border' x='0' y='0' />",
                "<text x='70' y='25' class='state'/>",
                "<text x='0' y='60'>",
                "<tspan class='caption'>Capital:</tspan>",
                "<tspan class='capital' dx='5'/>",
                "<tspan dy='14' x='0' class='caption'>Population:</tspan>",
                "<tspan class='population' dx='5'/>",
                "<tspan dy='14' x='0' class='caption'>Area:</tspan>",
                "<tspan class='area' dx='5'/>",
                "<tspan dx='5'>km</tspan><tspan dy='-2' class='sup'>2</tspan>",
                "</text></svg>"];

                var content = $(contentItems.join(""));

                content.find(".state").text(annotation.argument);
                content.find(".capital").text(data.capital);
                content.find(".population").text(formatNumber(data.population));
                content.find(".area").text(formatNumber(data.area));

                content.appendTo(container);
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
var formatNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format;