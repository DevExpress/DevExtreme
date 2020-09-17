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
        onRequestEditOperation: (e) => {
            var dataItem = e.args.shape && e.args.shape.dataItem;
            if(e.operation === "addShape") {
                if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
                    !e.updateUI && DevExpress.ui.notify("You can add only a 'Team' or 'Employee' shape.", "warning", 1000);
                    e.allowed = false;
                }
            }
            else if(e.operation === "deleteShape") {
                if(dataItem && dataItem.type === "root") {
                    !e.updateUI && DevExpress.ui.notify("You cannot delete the 'Development' shape.", "warning", 1000);
                    e.allowed = false;
                }
                if(dataItem && dataItem.type === "team") {
                    var children = orgItems.filter(function(item) { 
                        return item.parentId === dataItem.id;
                    });
                    if(children.length > 0) {
                        !e.updateUI && DevExpress.ui.notify("You cannot delete a 'Team' shape connected to an 'Employee' shape.", "warning", 1000);
                        e.allowed = false;
                    }
                }
            }
            else if(e.operation === "resizeShape") {
                if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
                    !e.updateUI && DevExpress.ui.notify("The shape size is too small.", "warning", 1000);
                    e.allowed = false;
                }
            }
            else if(e.operation === "changeConnection") {
                if(dataItem && dataItem.type === "root" && e.args.connectorPosition === "end") {
                    !e.updateUI && DevExpress.ui.notify("The 'Development' shape cannot have an incoming connection.", "warning", 1000);
                    e.allowed = false;
                }
                if(dataItem && dataItem.type === "team" && e.args.connectorPosition === "end") {
                    if(dataItem && dataItem.parentId !== undefined && dataItem.parentId !== null) {
                        !e.updateUI && DevExpress.ui.notify("A 'Team' shape can have only one incoming connection.", "warning", 1000);
                        e.allowed = false;
                    }
                }
                if(dataItem && dataItem.type === "employee") {
                    if(e.args.connectorPosition === "start")
                        e.allowed = false;
                    if(e.args.connectorPosition === "end" && dataItem.parentId !== undefined && dataItem.parentId !== null) {
                        !e.updateUI && DevExpress.ui.notify("An 'Employee' shape can have only one incoming connection.", "warning", 1000);
                        e.allowed = false;
                    }                        
                }
            }
            else if(e.operation === "changeConnectorPoints") {
                if(e.args.newPoints.length > 2) {
                    !e.updateUI && DevExpress.ui.notify("You cannot add points to a connector.", "warning", 1000);
                    e.allowed = false;
                }
            }
            else if(e.operation === "beforeChangeShapeText") {
                if(dataItem && dataItem.type === "root") {
                    !e.updateUI && DevExpress.ui.notify("You cannot change the 'Development' shape's text.", "warning", 1000);
                    e.allowed = false;
                }
            }
            else if(e.operation === "changeShapeText") {
                if(e.args.text === "") {
                    !e.updateUI && DevExpress.ui.notify("A shape text cannot be empty.", "warning", 1000);
                    e.allowed = false;
                }
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
