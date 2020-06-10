$(function() {
    var chart = $("#chart").dxChart({
        palette: "Violet",
        dataSource: dataSource,
        commonSeriesSettings: {
            barPadding: 0.3,
            argumentField: "state",
            type: "bar"
        },
        series: [
            {
                valueField: "year1990",
                name: "1990"
            },
            {
                valueField: "year2000",
                name: "2000"
            },
            {
                valueField: "year2010",
                name: "2010"
            },
            {
                valueField: "year2016",
                name: "2016"
            },
            {
                valueField: "year2017",
                name: "2017"
            }
        ],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        title: {
            text: "Oil Production",
            subtitle: {
                text: "(in millions tonnes)"
            }
        }
    }).dxChart("instance");

    $("#export").dxButton({
        icon: "export",
        text: "Export",
        type: "default",
        width: 145,
        onClick: function() {
            DevExpress.viz.exportFromMarkup(prepareMarkup(), {
                width: 820,
                height: 420,
                margin: 0,
                format: "png",
                svgToCanvas: function(svg, canvas) {
                    var deferred = $.Deferred();
                    
                    canvas.getContext('2d')
                        .drawSvg(new XMLSerializer().serializeToString(svg), 0, 0, null, null, {
                        renderCallback: deferred.resolve
                    });
                    return deferred.promise();
                }
            });
        }
    });

    function prepareMarkup() {
        return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="820px" height="420px">'
            + $('#custom_markup_container').html()
            + '<g transform="translate(305,12)">'
            + chart.svg()
            + '</g>'
            + '</svg>';
    }
});