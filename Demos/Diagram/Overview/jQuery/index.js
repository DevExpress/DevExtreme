$(function() {
    var diagram = $("#diagram").dxDiagram()
        .dxDiagram("instance");

    $.ajax({
        url: "../../../../data/diagram-flow.json",
        dataType: "text",
        success: function(data) {
            diagram.import(data);
        }
    });
});
