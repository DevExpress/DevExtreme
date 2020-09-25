$(function() {
    $("#diagram").dxDiagram({
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "id",
                data: flowNodes
            }),
			textExpr: "text",
			typeExpr: "type",
            autoLayout: {
                type: "layered"
            }
        },
        edges: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "id",
                data: flowEdges
            }),
            textExpr: "text",
            fromExpr: "fromId",
            toExpr: "toId",
        },
        toolbox: {
            groups: [ "general" ]
        }
    });
});
