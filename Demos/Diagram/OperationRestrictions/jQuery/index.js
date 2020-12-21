$(function() {
    function showToast(text) {
        DevExpress.ui.notify({ 
            position: { at: "top", my: "top", of: "#diagram", offset: "0 4" }, 
            message: text, 
            type: "warning", 
            delayTime: 2000
        });
    }
    function isParent(shapeToTest, shape) {
        if(shapeToTest.id === shape.id) return true;

        var diagram = $("#diagram").dxDiagram().dxDiagram("instance");
        for(var i = 0; i < shapeToTest.attachedConnectorIds.length; i++) {
            var connector = diagram.getItemById(shapeToTest.attachedConnectorIds[i]);
            if(connector.fromId === shapeToTest.id && connector.toId) {
                var childShape = diagram.getItemById(connector.toId);
                if(childShape.id === shape.id || isParent(childShape, shape))
                    return true;
            }
        }
        return false;
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
            var diagram = $("#diagram").dxDiagram().dxDiagram("instance");
            if(e.operation === "addShape") {
                if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
                    if(e.reason !== "checkUIElementAvailability")
                        showToast("You can add only a 'Team' or 'Employee' shape.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "deleteShape") {
                if(e.args.shape.type === "root") {
                    if(e.reason !== "checkUIElementAvailability")
                        showToast("You cannot delete the 'Development' shape.");
                    e.allowed = false;
                }
                if(e.args.shape.type === "team") {
                    for(var i = 0; i < e.args.shape.attachedConnectorIds.length; i++) {
                        if(diagram.getItemById(e.args.shape.attachedConnectorIds[i]).toId != e.args.shape.id) {
                            if(e.reason !== "checkUIElementAvailability")
                                showToast("You cannot delete a 'Team' shape that has a child shape.");
                            e.allowed = false;
                            break;
                        }
                    }
                }
            }
            else if(e.operation === "resizeShape") {
                if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
                    if(e.reason !== "checkUIElementAvailability")
                        showToast("The shape size is too small.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "changeConnection") {
                var shapeType = e.args.newShape && e.args.newShape.type;
                if(shapeType === "root" && e.args.connectorPosition === "end") {
                    if(e.reason !== "checkUIElementAvailability")
                        showToast("The 'Development' shape cannot have an incoming connection.");
                    e.allowed = false;
                }
                if(shapeType === "team") {
                    if(e.args.connectorPosition === "end" && e.args.newShape.attachedConnectorIds.length > 1) {
                        for(var i = 0; i < e.args.newShape.attachedConnectorIds.length; i++) {
                            if(e.args.connector && e.args.newShape.attachedConnectorIds[i] != e.args.connector.id) {
                                var connector = diagram.getItemById(e.args.newShape.attachedConnectorIds[i]);
                                if(connector.toId === e.args.newShape.id) {
                                    if(e.reason !== "checkUIElementAvailability")
                                        showToast("A 'Team' shape can have only one incoming connection.");
                                    e.allowed = false;
                                    break;
                                }
                            }
                        }
                    }
                    if(e.allowed && e.args.connector && e.args.connector.fromId && e.args.connector.toId) {
                        var shapeFrom = diagram.getItemById(e.args.connector.fromId);
                        var shapeTo = diagram.getItemById(e.args.connector.toId);
                        if(isParent(shapeTo, shapeFrom)) {
                            if(e.reason !== "checkUIElementAvailability")
                                showToast("A circular reference is not allowed.");
                            e.allowed = false;
                        }
                    }
                }
                if(shapeType === "employee") {
                    if(e.args.connectorPosition === "start")
                        e.allowed = false;
                    
                    if(e.args.connectorPosition === "end" && e.args.newShape.attachedConnectorIds.length > 1) {
                        if(e.reason !== "checkUIElementAvailability")
                            showToast("An 'Employee' shape can have only one incoming connection.");
                        e.allowed = false;
                    }                        
                }
            }
            else if(e.operation === "changeConnectorPoints") {
                if(e.args.newPoints.length > 2) {
                    if(e.reason !== "checkUIElementAvailability")
                        showToast("You cannot add points to a connector.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "beforeChangeShapeText") {
                if(e.args.shape.type === "root") {
                    if(e.reason !== "checkUIElementAvailability")
                        showToast("You cannot change the 'Development' shape's text.");
                    e.allowed = false;
                }
            }
            else if(e.operation === "changeShapeText") {
                if(e.args.text === "") {
                    if(e.reason !== "checkUIElementAvailability")
                        showToast("A shape text cannot be empty.");
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
