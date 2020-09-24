$(function() {
    $("#diagram").dxDiagram({
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "ID",
                data: employees
            }),
            keyExpr: "ID",
            textExpr: "Title",
            parentKeyExpr: "Head_ID",
            autoLayout: {
                type: "tree"
            }
        },
        toolbox: {
            groups: ["general"]
        }
    });
});
