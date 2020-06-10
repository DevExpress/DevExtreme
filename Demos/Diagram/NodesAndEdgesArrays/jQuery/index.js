$(function() {
    $("#diagram").dxDiagram({
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "this",
                data: orgItems
            }),
            autoLayout: {
                type: "tree"
            }
        },
        edges: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "this",
                data: orgLinks
            })
        },
        toolbox: {
            groups: [ "general" ]
        }
    });
});
