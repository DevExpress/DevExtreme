$(function() {
    $("#diagram").dxDiagram({
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "this",
                data: employees
            }),
            textExpr: "Title",
            itemsExpr: "Items",
            autoLayout: {
                type: "tree"
            }
        },
        toolbox: {
            groups: ["general"]
        }
    });
});
