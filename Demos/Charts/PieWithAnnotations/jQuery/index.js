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
        var country = data.country + (data.oldCountryName ? "<br />" + data.oldCountryName : "");
        $("<div class='medal-tooltip'><div class='country-name'>" + country
            + "</div><div><span class='caption'>Gold</span>: " + data.gold
            + "</div><div><span class='caption'>Silver</span>: " + data.silver
            + "</div><div><span class='caption'>Bronze</span>: " + data.bronze
            + "</div></div>").appendTo(container);
    }
});
