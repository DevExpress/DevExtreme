$(function() {
    function showToast(text) {
        DevExpress.ui.notify({ 
            position: { at: "top", my: "top", of: "#diagram", offset: "0 4" }, 
            message: text, 
            type: "warning", 
            delayTime: 2000
        });
    }
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
                key: "ID",
                data: orgItems
            }),
            keyExpr: "ID",
            textExpr: "Name",
            typeExpr: "Type",
            parentKeyExpr: "ParentID",
            autoLayout: {
                type: "tree"
            }
        },
        onRequestLayoutUpdate: function(e) { 
            for(var i = 0; i < e.changes.length; i++) {
                if(e.changes[i].type === 'remove')
                    e.allowed = true;
                else if(e.changes[i].data.ParentID !== undefined && e.changes[i].data.ParentID !== null)
                    e.allowed = true;
            }
        },
        onRequestEditOperation: function(e) {
            var dataItem;
            if(e.operation === "addShape") {
                if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
                    !e.updateUI && showToast("You can add only a 'Team' or 'Employee' shape.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "deleteShape") {
                dataItem = e.args.shape && e.args.shape.dataItem;
                if(dataItem && dataItem.Type === "root") {
                    !e.updateUI && showToast("You cannot delete the 'Development' shape.");
                    e.allowed = false;
                }
                if(dataItem && dataItem.Type === "team") {
                    var children = orgItems.filter(function(item) { 
                        return item.ParentID === dataItem.ID;
                    });
                    if(children.length > 0) {
                        !e.updateUI && showToast("You cannot delete a 'Team' shape that has a child shape.");
                        e.allowed = false;
                    }
                }
            }
            else if(e.operation === "resizeShape") {
                if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
                    !e.updateUI && showToast("The shape size is too small.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "changeConnection") {
                dataItem = e.args.newShape && e.args.newShape.dataItem;
                if(dataItem && dataItem.Type === "root" && e.args.connectorPosition === "end") {
                    !e.updateUI && showToast("The 'Development' shape cannot have an incoming connection.");
                    e.allowed = false;
                }
                if(dataItem && dataItem.Type === "team" && e.args.connectorPosition === "end") {
                    if(dataItem && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
                        !e.updateUI && showToast("A 'Team' shape can have only one incoming connection.");
                        e.allowed = false;
                    }
                }
                if(dataItem && dataItem.Type === "employee") {
                    if(e.args.connectorPosition === "start")
                        e.allowed = false;
                    if(e.args.connectorPosition === "end" && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
                        !e.updateUI && showToast("An 'Employee' shape can have only one incoming connection.");
                        e.allowed = false;
                    }                        
                }
            }
            else if(e.operation === "changeConnectorPoints") {
                if(e.args.newPoints.length > 2) {
                    !e.updateUI && showToast("You cannot add points to a connector.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "beforeChangeShapeText") {
                dataItem = e.args.shape && e.args.shape.dataItem;
                if(dataItem && dataItem.Type === "root") {
                    !e.updateUI && showToast("You cannot change the 'Development' shape's text.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "changeShapeText") {
                if(e.args.text === "") {
                    !e.updateUI && showToast("A shape text cannot be empty.");
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
