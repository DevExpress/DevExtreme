$(function(){
    $("#pie").dxPieChart({
        palette: paletteCollection[0],
        dataSource: dataSource,
        series: {},
        legend: {
            visible: false
        },
        onDrawn: function(e) { 
            var paletteName = e.component.option("palette"),
                palette = DevExpress.viz.getPalette(paletteName).simpleSet,
                paletteContainer = $(".palette-container");
            
            paletteContainer.html("");
            
            palette.forEach(function(color) {
                $("<div>").css({
                    backgroundColor: color
                })
                    .addClass("palette-item")
                    .appendTo(paletteContainer);
            });
        }
    });

    $("#palette").dxSelectBox({
        items: paletteCollection,
        value: paletteCollection[0],
        onValueChanged: function(e) {
            $("#pie").dxPieChart({
                palette: e.value
            });
        }
    });

    $("#extension-mode").dxSelectBox({
        items: paletteExtensionModes,
        value: "Blend",
        onValueChanged: function(e) {
            $("#pie").dxPieChart({
                paletteExtensionMode: e.value
            });
        }
    });
});