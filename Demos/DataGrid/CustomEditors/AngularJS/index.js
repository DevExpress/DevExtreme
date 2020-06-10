var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "ID",
            loadUrl: url + "/Tasks",
            updateUrl: url + "/UpdateTask",
            insertUrl: url + "/InsertTask",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        }),
        showBorders: true,
        paging: {
            enabled: true,
            pageSize: 15
        },
        headerFilter: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        editing: {
            mode: "cell",
            allowUpdating: true,
            allowAdding: true
        },
        onRowInserted: function(e) {
            e.component.navigateToRow(e.key);
        },
        columns: [{
                dataField: "Owner",
                width: 150,
                allowSorting: false,
                lookup: {
                    dataSource: employees,
                    valueExpr: "ID",
                    displayExpr: "FullName"
                },
                validationRules: [{ type: "required" }],
                editCellTemplate: "dropDownBoxEditorTemplate"
            }, {
                dataField: "AssignedEmployee",
                caption: "Assignees",
                width: 200,
                allowSorting: false,
                editCellTemplate: "tagBoxEditorTemplate",
                lookup: {
                    dataSource: employees,
                    valueExpr: "ID",
                    displayExpr: "FullName"
                },
                validationRules: [{ type: "required" }],
                cellTemplate: function(container, options) {
                    var noBreakSpace = "\u00A0",
                        text = (options.value || []).map(function(element) {
                            return options.column.lookup.calculateCellValue(element);
                        }).join(", ");
                    container.text(text || noBreakSpace).attr("title", text);
                },
                calculateFilterExpression: function(filterValue, selectedFilterOperation, target) {
                    if(target === "search" && typeof(filterValue) === "string") {
                        return [this.dataField, "contains", filterValue]
                    }
                    return function(data) {
                        return (data.AssignedEmployee || []).indexOf(filterValue) !== -1
                    }
                }
            }, {
                dataField: "Subject",
                validationRules: [{ type: "required" }]
            }, {
                dataField: "Status",
                lookup: {
                    dataSource: statuses,
                    valueExpr: "id",
                    displayExpr: "name"
                },
                validationRules: [{ type: "required" }],
                width: 200,
                editorOptions: {
                    itemTemplate: "statusTemplate"
                }
            }
        ]
    }

    $scope.initTagBoxEditor = function(data) {
        return {
            dataSource: employees,
            value: data.value,
            valueExpr: "ID",
            displayExpr: "FullName",
            showSelectionControls: true,
            maxDisplayedTags: 3,
            showMultiTagOnly: false,
            applyValueMode: "useButtons",
            searchEnabled: true,
            onValueChanged: function(e) {
                data.setValue(e.value);
            },
            onSelectionChanged: function(e) {
                data.component.updateDimensions();
            }
        }
    }

    $scope.initDropDownBoxEditor = function(data) {
        return {
            dropDownOptions: { width: 500 },
            dataSource: employees,
            value: data.value,
            valueExpr: "ID",
            displayExpr: "FullName",
            contentTemplate: "contentTemplate"
        }
    }

    $scope.initContent = function(data, component) {
        return {
            dataSource: employees,
            remoteOperations: true,
            columns: ["FullName", "Title", "Department"],
            hoverStateEnabled: true,
            scrolling: { mode: "virtual" },
            height: 250,
            selection: { mode: "single" },
            selectedRowKeys: [data.value],
            focusedRowEnabled: true,
            focusedRowKey: data.value,
            onSelectionChanged: function(selectionChangedArgs) {
                component.option("value", selectionChangedArgs.selectedRowKeys[0]);
                data.setValue(selectionChangedArgs.selectedRowKeys[0]);
                if(selectionChangedArgs.selectedRowKeys.length > 0) {
                    component.close();
                }
            }
        }
    }
});