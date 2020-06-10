$(function() {
    var diagram = $("#diagram").dxDiagram({
        contextMenu: {
            enabled: true,
            commands: ["bringToFront","sendToBack", "lock", "unlock"]
        },
        contextToolbox: {
            enabled: true,
            category: "flowchart"
        },
        propertiesPanel: {
            visibility: 'visible',
            tabs: [
                {
                    groups: [ { title: "Page Properties", commands: ["pageSize", "pageOrientation", "pageColor"] } ]
                }
            ]
        },
        historyToolbar: {
            visible: false
        },
        viewToolbar: {
            visible: true
        },
        mainToolbar: {
            visible: true,
            commands: ["undo","redo","separator","fontName","fontSize","separator","bold","italic","underline","separator",
                "fontColor","lineColor","fillColor","separator",{ name: "clear", icon: "clearsquare", text: "Clear Diagram" }]
        },
        toolbox: {
            visibility: 'visible',
            groups: [
                "general", { category: "flowchart", title: "Flowchart", expanded: true }
            ]
        },
        onCustomCommand: function(e) {
            if(e.name === "clear") {
                var result = DevExpress.ui.dialog.confirm("Are you sure you want to clear the diagram? This action cannot be undone.", "Warning");
                result.done(
                    function(dialogResult) {
                        if(dialogResult) {
                            e.component.import("");
                        }
                    }
                );
            }
        }
    }).dxDiagram("instance");

    $.ajax({
        url: "../../../../data/diagram-flow.json",
        dataType: "text",
        success: function(data) {
            diagram.import(data);
        }
    });
});
