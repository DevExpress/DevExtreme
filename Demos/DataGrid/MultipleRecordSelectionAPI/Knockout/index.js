window.onload = function() {
    var selectedItemsText = ko.observable("Nobody has been selected"),
        selectedPrefix = ko.observable(null),
        clearButtonDisabled = ko.observable(true);
        
    var viewModel = {
        selectedItemsText: selectedItemsText,
        gridOptions: {
            dataSource: employees,
            keyExpr: "ID",
            showBorders: true,
            selection: {
                mode: "multiple"
            },
            columns: [{
                    dataField: "Prefix",
                    caption: "Title",
                    width: 70
                },
                "FirstName",
                "LastName", {
                    dataField: "Position",
                    width: 180
                }, {
                    dataField: "BirthDate",
                    dataType: "date",
                    width: 125
                }, {
                    dataField: "HireDate",
                    dataType: "date",
                    width: 125
                }
            ],
            onSelectionChanged: function(selectedItems) {
                var data = selectedItems.selectedRowsData;
    
                if(data.length > 0)
                    selectedItemsText($.map(data, function(value) {
                        return value.FirstName + " " + value.LastName;
                    }).join(", "));
                else 
                    selectedItemsText("Nobody has been selected");
    
                selectedPrefix(null);
                clearButtonDisabled(!data.length);
            }
        },
        selectPrefixOptions: {
            dataSource: ["All", "Dr.", "Mr.", "Mrs.", "Ms."],
            placeholder: "Select title",
            value: selectedPrefix,
            onValueChanged: function (data) {
                var dataGrid = $("#grid-container").dxDataGrid("instance"); 
    
                if(!data.value)
                    return;
    
                if (data.value == "All") {
                    dataGrid.selectAll();
                } else {
                    var employeesToSelect = $.map($.grep(dataGrid.option("dataSource"), function(item) {
                        return item.Prefix === data.value;
                    }), function(item) {
                        return item.ID;
                    });
                    dataGrid.selectRows(employeesToSelect);
                }
    
                selectedPrefix(data.value);
            }
        },
        clearButtonOptions: {
            text: "Clear Selection",
            disabled: clearButtonDisabled,
            onClick: function () {
                $("#grid-container").dxDataGrid("instance").clearSelection();
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("grid"));
};