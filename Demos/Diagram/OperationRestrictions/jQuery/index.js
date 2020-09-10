$(function() {
    $("#diagram").dxDiagram({
        customShapes: [{
            category: "items",
            type: "root",
            baseType: "octagon",
            defaultText: "Development"
        },
        {
            category: "items",
            type: "team",
            title: "Team",
            baseType: "ellipse",
            defaultText: "Team Name"
        }, 
        {
            category: "items",
            type: "employee",
            title: "Employee",
            baseType: "rectangle",
            defaultText: "Employee Name"
        }],
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "id",
                data: orgItems
            }),
            textExpr: "name",
            parentKeyExpr: "parentId",
            autoLayout: {
                type: "tree"
            }
        },
        onRequestLayoutUpdate: function(e) { 
            for(var i = 0; i < e.changes.length; i++) {
                if(e.changes[i].type === 'remove')
                    e.allowed = true;
                else if(e.changes[i].data.parentId !== undefined && e.changes[i].data.parentId !== null)
                    e.allowed = true;
            }
        },
        onRequestOperation: (e) => {
            if(e.operation === "addShape") {
                if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
                    e.allowed = false;
                }
            }
            else if(e.operation === "deleteShape") {
                if(e.args.shape.dataItem && e.args.shape.dataItem.type === "root") {
                    e.allowed = false;
                }
                if(e.args.shape.dataItem && e.args.shape.dataItem.type === "team") {
                    var children = orgItems.filter(function(item) { 
                        return item.parentId === e.args.shape.dataItem.id;
                    });
                    if(children.length > 0)
                        e.allowed = false;
                }
            }
            else if(e.operation === "deleteConnector") {
                e.allowed = false;
            }
            else if(e.operation === "changeConnection") {
                if(e.args.connectorPosition === "end" && e.args.shape === undefined)
                    e.allowed = false;
                if(e.args.shape.dataItem && e.args.shape.dataItem.type === "root" && e.args.connectorPosition === "end")
                    e.allowed = false;
                if(e.args.shape.dataItem && e.args.shape.dataItem.type === undefined) {
                    if(e.args.connectorPosition === "start")
                        e.allowed = false;
                    if(e.args.connectorPosition === "end" && e.args.shape.dataItem.parentId !== undefined && e.args.shape.dataItem.parentId !== null)
                        e.allowed = false;
                }
            }
            else if(e.operation === "changeConnectorPoints") {
                if(e.args.newPoints.length > 2)
                    e.allowed = false;
            }
            else if(e.operation === "beforeChangeShapeText") {
                if(e.args.shape.dataItem && e.args.shape.dataItem.type === "root")
                    e.allowed = false;
            }
            else if(e.operation === "changeShapeText") {
                if(e.args.text === "")
                    e.allowed = false;
            }
            else if(e.operation === "beforeChangeConnectorText") {
                e.allowed = false;
            }
        },
        contextToolbox: {
            shapeIconsPerRow: 2,
            width: 100,
            shapes: [ "team", "employee" ]
        },
        toolbox: {
            shapeIconsPerRow: 2,
            groups: [ { title: "Items", shapes: [ "team", "employee" ] } ]
        },
        propertiesPanel: {
            visibility: "disabled"
        }
    });
});
