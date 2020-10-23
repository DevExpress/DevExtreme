$(function () {
    $("#pie").dxPieChart({
        palette: "Vintage",
        dataSource: dataSource,
        commonAnnotationSettings: {
            type: "image",
            image: {
                height: 60,
                width: 90
            },
            color: "transparent",
            border: {
                color: "transparent"
            },
            paddingLeftRight: 0,
            paddingTopBottom: 0,
            tooltipTemplate: tooltipTemplate
        },
        annotations: getAnnotationSources(),
        series: [{
            argumentField: "country",
            valueField: "gold",
            label: {
                visible: true,
                position: "inside",
                radialOffset: 83,
                backgroundColor: "transparent",
                font: {
                    size: 16,
                    weight: 600
                }
            }
        }],
        tooltip: {
            paddingLeftRight: 12,
            paddingTopBottom: 10,
        },
        legend: {
            visible: false
        },
        title: "Ice Hockey World Championship Gold Medal Winners"
    });

    function getAnnotationSources() {
        annotations.forEach(function(a, index, array) {
            array[index].image = "../../../../images/flags/3x2/" + a.argument.replace(/\s/, "") + ".svg";
            array[index].data = $.extend({}, dataSource.filter(function(d) { return d.country === a.argument; })[0]);
            if(a.location === "edge") {
                array[index] = $.extend({}, a, edgeAnnotationSettings)
            }
        });

        return annotations;
    }

    function tooltipTemplate(annotation, container) {
        var data = annotation.data;
        var contentItems = ["<div class='medal-tooltip'>",
        "<div class='country-name'></div>",
        "<div class='gold'><span class='caption'>Gold</span>: </div>",
        "<div class='silver'><span class='caption'>Silver</span>: </div>",
        "<div class='bronze'><span class='caption'>Bronze</span>: </div>",
        "</div>"];

        var content = $(contentItems.join(""));

        content.find(".country-name").text(data.country);
        if(data.oldCountryName) {
            content.find(".country-name").append("<br/>").append(document.createTextNode(data.oldCountryName));
        }
        content.find(".gold").append(document.createTextNode(data.gold));
        content.find(".silver").append(document.createTextNode(data.silver));
        content.find(".bronze").append(document.createTextNode(data.bronze));
            
        content.appendTo(container);
    }
});
