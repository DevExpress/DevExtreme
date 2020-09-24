$(function() {
    var diagram = $("#diagram").dxDiagram({
        readOnly: true,
        customShapes: employees.map(
            function(emp) {
                return {
                    type: "employee" + emp.ID,
                    baseType: "rectangle",
                    defaultWidth: 1.5,
                    defaultHeight: 1,
                    allowEditText: false,
                    allowResize: false
                }
            }
        ),
        customShapeTemplate: function(item, $container) {
            var employee = item.dataItem;
            var $content = $("<svg class='template'>" +
                "<text class='template-name' x='50%' y='20%'>" + employee.Full_Name + "</text>" +
                "<text class='template-title' x='50%' y='45%'>" + employee.Title + "</text>" +
                "<text class='template-button' x='50%' y='85%'>Show Details</text>" +
                "</svg >");
            $container.append($content);
            $content.find(".template-button").click(function(evt) {
                showInfo(employee);
            });
        },
        nodes: {
            dataSource: new DevExpress.data.ArrayStore({
                key: "ID",
                data: employees
            }),
            keyExpr: "ID",
            typeExpr: function(obj) { return "employee" + obj.ID; },
            parentKeyExpr: "Head_ID",
            autoLayout: {
                type: "tree"
            }
        }
    }).dxDiagram("instance");

    var currentEmployee = {},
        popup = null,
        popupOptions = {
            width: 300,
            height: 280,
            contentTemplate: function() {
                return $("<div />").append(
                    $("<p>Full Name: <b>" + currentEmployee.Full_Name + "</b></p>"),
                    $("<p>Title: <b>" + currentEmployee.Title + "</b></p>"),
                    $("<p>City: <b>" + currentEmployee.City + "</b></p>"),
                    $("<p>State: <b>" + currentEmployee.State + "</b></p>"),
                    $("<p>Email: <b>" + currentEmployee.Email + "</b></p>"),
                    $("<p>Skype: <b>" + currentEmployee.Skype + "</b></p>"),
                    $("<p>Mobile Phone: <b>" + currentEmployee.Mobile_Phone + "</b></p>")
                );
            },
            showTitle: true,
            title: "Information",
            visible: false,
            dragEnabled: false,
            closeOnOutsideClick: true
        };

    var showInfo = function(data) {
        currentEmployee = data;

        if(popup) {
            popup.option("contentTemplate", popupOptions.contentTemplate.bind(this));
        } else {
            popup = $("#popup").dxPopup(popupOptions).dxPopup("instance");
        }

        popup.show();
    };
});
