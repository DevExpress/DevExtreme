$(function() {
    var diagram = $("#diagram").dxDiagram({
        readOnly: true
    }).dxDiagram("instance");

    $.ajax({
        url: "../../../../data/diagram-structure.json",
        dataType: "text",
        success: function(data) {
            diagram.import(data);
        }
    });
});
