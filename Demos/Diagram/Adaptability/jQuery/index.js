$(function() {
    var diagram = $("#diagram").dxDiagram({
        autoZoomMode: 'fitWidth'
    }).dxDiagram("instance");

    $.ajax({
        url: "../../../../data/diagram-flow.json",
        dataType: "text",
        success: function(data) {
            diagram.import(data);
        }
    });
});
