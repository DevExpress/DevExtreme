$(function() {
    $("#diagram").dxDiagram({
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "this",
                data: orgItems
            }),
            imageUrlExpr: "picture",
            autoLayout: {
                type: "tree",
                orientation: "horizontal"
            }
        },
        edges: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "this",
                data: orgLinks
            })
        },
        toolbox: {
            groups: ["general", { category: "orgChart", title: "Organizational Chart", expanded: true }]
        }
    });
});
