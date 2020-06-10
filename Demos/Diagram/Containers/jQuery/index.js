$(function() {
    var diagram = $("#diagram").dxDiagram({
        toolbox: {
            groups: [ "general", { category: "containers", title: "Containers", expanded: true }]
        }
    }).dxDiagram("instance");

    $.ajax({
        url: "../../../../data/diagram-structure.json",
        dataType: "text",
        success: function(data) {
            diagram.import(data);
        }
    });
});
