$(function() {
    var generatedID = 100;
    var store = new DevExpress.data.ArrayStore({
        key: "ID",
        data: employees,
        onInserting: function(values) {
            values.ID = values.ID || generatedID++;
            values.Full_Name = values.Full_Name || "Employee's Name";
            values.Title = values.Title || "Employee's Title";
        }
    });
    var diagram = $("#diagram").dxDiagram({
        customShapes: [{
            type: "employee",
            category: "employee",
            baseType: "rectangle",
            title: "New Employee",
            defaultWidth: 1.5,
            defaultHeight: 1,
            toolboxWidthToHeightRatio: 2,
            minWidth: 1.5,
            minHeight: 1,
            maxWidth: 3,
            maxHeight: 2,
            allowEditText: false
        }],
        customShapeTemplate: function(item, $container) {
            var employee = item.dataItem;
            var svgNS = "http://www.w3.org/2000/svg";
            var $content = $(document.createElementNS(svgNS, "svg")).addClass("template");
            $(document.createElementNS(svgNS, "text"))
                .addClass("template-name")
                .attr({ x: "50%", y: "20%" })
                .text(employee ? employee.Full_Name : "Employee's Name")
                .appendTo($content);
            $(document.createElementNS(svgNS, "text"))
                .addClass("template-title")
                .attr({ x: "50%", y: "45%" })
                .text(employee ? employee.Title : "Employee's Title")
                .appendTo($content);
            $(document.createElementNS(svgNS, "text"))
                .addClass("template-button")
                .attr({ id: "employee-edit", x: "40%", y: "85%" })
                .text("Edit")
                .click(function() { editEmployee(employee); })
                .appendTo($content);
            $(document.createElementNS(svgNS, "text"))
                .addClass("template-button")
                .attr({ id: "employee-delete", x: "62%", y: "85%" })
                .text("Delete")
                .click(function() { deleteEmployee(employee); })                
                .appendTo($content);                       
            $container.append($content); 
        },
        customShapeToolboxTemplate: function(item, $container) {
            var employee = item.dataItem;
            var $content = $("<svg class='template'>" +
                "<text x='50%' y='40%'>New</text>" +
                "<text x='50%' y='70%'>Employee</text>" +
                "</svg >");
            $container.append($content);
        },
        nodes: {
            dataSource: store,
            keyExpr: "ID",
            typeExpr: function(obj) { return "employee"; },
            parentKeyExpr: "Head_ID",
            customDataExpr: function(obj, value) {
                if(value === undefined) {
                    return {
                        "Full_Name": obj.Full_Name,
                        "Prefix": obj.Prefix,
                        "Title": obj.Title,
                        "City": obj.City,
                        "State": obj.State,
                        "Email": obj.Email,
                        "Skype": obj.Skype,
                        "Mobile_Phone": obj.Mobile_Phone
                    };
                } else {
                    obj.Full_Name = value.Full_Name;
                    obj.Prefix = value.Prefix;
                    obj.Title = value.Title;
                    obj.City = value.City;
                    obj.State = value.State;
                    obj.Email = value.Email;
                    obj.Skype = value.Skype;
                    obj.Mobile_Phone = value.Mobile_Phone;
                }
            },
            autoLayout: {
                type: "tree"
            }
        },
        onRequestLayoutUpdate: function(e) {
            for(var i = 0; i < e.changes.length; i++) {
                if(e.changes[i].type === 'remove')
                    e.allowed = true;
                else if(e.changes[i].data.Head_ID !== undefined && e.changes[i].data.Head_ID !== null)
                    e.allowed = true;
            }
        },
        contextToolbox: {
            shapeIconsPerRow: 1,
            width: 100
        },
        toolbox: {
            shapeIconsPerRow: 1,
            showSearch: false,
            groups: [
                { category: "employee", title: "Employee", expanded: true }
            ]
        },
        propertiesPanel: {
            tabs: [
                {
                    groups: [ { title: "Page Properties", commands: ["pageSize", "pageOrientation", "pageColor"] } ]
                }
            ]
        }
    }).dxDiagram("instance");

    var popupContentTemplate = function($container) {
        var $editorsContainer = $("<div class=\"dx-fieldset\" />").appendTo($container);
        var $nameField = $("<div class=\"dx-field\"><div class=\"dx-field-label\">Name</div><div class=\"dx-field-value\" data-field=\"Full_Name\" /></div>");
        $nameField.find(".dx-field-value").append("<div />").dxTextBox();
        var $titleField = $("<div class=\"dx-field\"><div class=\"dx-field-label\">Title</div><div class=\"dx-field-value\" data-field=\"Title\" /></div>");
        $titleField.find(".dx-field-value").append("<div /").dxTextBox();
        var $cityField = $("<div class=\"dx-field\"><div class=\"dx-field-label\">City</div><div class=\"dx-field-value\" data-field=\"City\" /></div>");
        $cityField.find(".dx-field-value").append("<div /").dxTextBox();
        var $stateField = $("<div class=\"dx-field\"><div class=\"dx-field-label\">State</div><div class=\"dx-field-value\" data-field=\"State\" /></div>");
        $stateField.find(".dx-field-value").append("<div /").dxTextBox();
        var $emailField = $("<div class=\"dx-field\"><div class=\"dx-field-label\">Email</div><div class=\"dx-field-value\" data-field=\"Email\" /></div>");
        $emailField.find(".dx-field-value").append("<div /").dxTextBox();
        var $skypeField = $("<div class=\"dx-field\"><div class=\"dx-field-label\">Skype</div><div class=\"dx-field-value\" data-field=\"Skype\" /></div>");
        $skypeField.find(".dx-field-value").append("<div /").dxTextBox();
        var $phoneField = $("<div class=\"dx-field\"><div class=\"dx-field-label\">Phone</div><div class=\"dx-field-value\" data-field=\"Mobile_Phone\" /></div>");
        $phoneField.find(".dx-field-value").append("<div /").dxTextBox();

        $editorsContainer.append($nameField, $titleField, $cityField, $stateField, $emailField, $skypeField, $phoneField);
        var $buttonsContainer = $("<div class=\"dx-fieldset buttons\" />").appendTo($container);
        $buttonsContainer.append(
            $("<button />").dxButton({
                text: "Update",
                type: "default",
                onClick: updateEmployee
            }),
            $("<button />").dxButton({
                text: "Cancel",
                onClick: cancelEditEmployee
            })
        );
    };
    var popup = $("#popup").dxPopup({
        width: 400,
        height: 480,
        showTitle: true,
        title: "Edit Employee",
        visible: false,
        dragEnabled: false,
        contentTemplate: popupContentTemplate.bind(this)
    }).dxPopup("instance");

    var currentEmployee = {};

    var editEmployee = function(employee) {
        currentEmployee = Object.assign({}, employee);

        popup.show();
        popup.content().find(".dx-field-value").each(function() {
            var field = $(this).attr("data-field");
            var edit = $(this).dxTextBox("instance");
            edit.option({
                value: currentEmployee[field],
                onValueChanged: function(e) { handleChange(field, e.value); }
            });
        });
    };
    var deleteEmployee = function(employee) {
        store.push([{ type: 'remove', key: employee.ID }]);
    };
    var updateEmployee = function() {
        store.push([{ 
            type: 'update',
            key: currentEmployee.ID, 
            data: {
                "Full_Name": currentEmployee.Full_Name,
                "Title": currentEmployee.Title,
                "City": currentEmployee.City,
                "State": currentEmployee.State,
                "Email": currentEmployee.Email,
                "Skype": currentEmployee.Skype,
                "Mobile_Phone": currentEmployee.Mobile_Phone
            }
        }]);
        popup.hide();
    };
    var cancelEditEmployee = function() {
        currentEmployee = {};
        popup.hide();
    }
    var handleChange = function(field, value) {
        currentEmployee[field] = value;
    }
});
