var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.selectedItemsText = "Nobody has been selected",
    $scope.selectedPrefix = null;
    $scope.clearButtonDisabled = true;
    
    $scope.gridOptions = {
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
                $scope.selectedItemsText = $.map(data, function(value) {
                    return value.FirstName + " " + value.LastName;
                }).join(", ");
            else 
                $scope.selectedItemsText = "Nobody has been selected";
    
            $scope.selectedPrefix = null;
            $scope.clearButtonDisabled = !data.length;
        }
    };
    
    $scope.selectPrefixOptions = {
        dataSource: ["All", "Dr.", "Mr.", "Mrs.", "Ms."],
        placeholder: "Select title",
        bindingOptions: {
            value: "selectedPrefix"
        },
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
    
            $scope.selectedPrefix = data.value;
        }
    };
    
    $scope.clearButtonOptions = {
        text: "Clear Selection",
        bindingOptions: {
            disabled: "clearButtonDisabled"
        },
        onClick: function () {
            $("#grid-container").dxDataGrid("instance").clearSelection();
        }
    };
    
});