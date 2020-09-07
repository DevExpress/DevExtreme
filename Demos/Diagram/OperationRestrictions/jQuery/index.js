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
            typeExpr: itemTypeExpr,
            textExpr: "name",
            parentKeyExpr: "parentId",
            autoLayout: {
                type: "tree",
                requestUpdate: function(changes) { 
                    for(var i = 0; i < changes.length; i++) {
                        if(changes[i].type === 'remove')
                            return true;
                        else if(changes[i].data.parentId !== undefined && changes[i].data.parentId !== null)
                            return true;
                    }
                    return false;
                } 
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

    function itemTypeExpr(obj, value) {
        if(value) {
            if(value !== "employee")
                obj.type = value;
            else
                obj.type = undefined;
        } else {
            if(obj.type !== undefined)
                return obj.type;
            return "employee";
        }
    }
});
